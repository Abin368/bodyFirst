
import { inject, injectable } from 'inversify'
import Stripe from 'stripe'
import mongoose from 'mongoose'
import TYPES from '../../di/types'
import logger from '../../utils/logger'
import { IOwnerProfileRepository } from '../../interfaces/repository/IOwnerProfileRepository'
import { IOwnerPaymentRepository } from '../../interfaces/repository/IOwnerPaymentRepository'
import { IStripeEventLogRepository } from '../../interfaces/repository/IStripeEventLogRepository'
import { IStripeWebhookService } from '../../interfaces/services/IStripeWebhookService'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { StripeEventType } from '../../enums/stripe.enums'
import { MESSAGES } from '../../enums/message.constant';
import { StripeEventStatus } from '../../enums/stripe.enums'


type EventHandler = (event: Stripe.Event) => Promise<void>

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
  private handlers: Record<string, EventHandler>

  constructor(
    @inject(TYPES.StripeClient) private readonly stripe: Stripe,
    @inject(TYPES.OwnerProfileRepository) private readonly _ownerProfileRepo: IOwnerProfileRepository,
    @inject(TYPES.OwnerPaymentRepository) private readonly _ownerPaymentRepo: IOwnerPaymentRepository,
    @inject(TYPES.StripeEventLogRepository) private readonly _eventLogRepo: IStripeEventLogRepository
  ) {
  
    this.handlers = {
      [StripeEventType.CHECKOUT_SESSION_COMPLETED]: this.handleCheckoutSessionCompleted.bind(this),
      [StripeEventType.PAYMENT_INTENT_PAYMENT_FAILED]: this.handlePaymentFailed.bind(this),
    };
    
  }


  async handleWebhook(body: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event
    try {
      event = this.stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET as string)
    } catch (err: any) {
      logger.error('Stripe signature verification failed', { err })
      throw new AppError(HttpStatus.BAD_REQUEST,MESSAGES.STRIPE.INVALID_SIGNATURE)
    }

    const inserted = await this._eventLogRepo.createIfNotExists(event.id, event.type,StripeEventStatus.PROCESSING )
    if (!inserted) {
      logger.warn('Duplicate Stripe event received, skipping', { eventId: event.id })
      return
    }


    const handler = this.handlers[event.type]
    if (!handler) {
      logger.info('Unhandled Stripe event type', { eventType: event.type, eventId: event.id })
      await this._eventLogRepo.updateStatus(event.id, StripeEventStatus.SUCCESS) 
      return
    }

    try {
      await handler(event)
      await this._eventLogRepo.updateStatus(event.id,StripeEventStatus.SUCCESS)
    } catch (err) {
      logger.error('Error processing Stripe event', { eventId: event.id, err })
      await this._eventLogRepo.updateStatus(event.id, StripeEventStatus.FAILED, err instanceof Error ? err.message : String(err))
     
      throw err
    }
  }


  private async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session
    const ownerId = session.metadata?.ownerId
    if (!ownerId) {
      logger.warn('Checkout session missing ownerId', { eventId: event.id })
      return
    }

 
    const dbSession = await mongoose.startSession()
    dbSession.startTransaction()
    try {
    
      const profile = await this._ownerProfileRepo.findByUserId(ownerId)
      if (!profile) throw new AppError(HttpStatus.NOT_FOUND,MESSAGES.USER.NOT_FOUND)
       

   
      await this._ownerPaymentRepo.createPayment(
        {
          ownerId:new mongoose.Types.ObjectId(profile._id.toString()),
          stripeSessionId: session.id,
          stripePaymentIntentId: session.payment_intent as string,
          stripeEventId: event.id,
          amount: (session.amount_total ?? 0) / 100,
          currency: (session.currency ?? 'INR').toUpperCase(),
          status: 'SUCCESS',
        },
        dbSession
      )

   
      await this._ownerProfileRepo.updateByUserId(
        ownerId,
        {
          subscriptionStatus: 'ACTIVE',
          subscriptionStart: new Date(),
          subscriptionExpiry:new Date(Date.now() + 30*24*60*60*1000),
          stripeCustomerId: session.customer as string,
          stripePriceId: session.metadata?.priceId,
        },
        dbSession
      )

      await dbSession.commitTransaction()
      logger.info('Checkout session processed', { ownerId, sessionId: session.id, eventId: event.id })
    } catch (err) {
      await dbSession.abortTransaction()
      logger.error('Failed processing checkout session', { err, eventId: event.id })
      throw err
    } finally {
      dbSession.endSession()
    }
  }

  private async handlePaymentFailed(event: Stripe.Event): Promise<void> {
    const intent = event.data.object as Stripe.PaymentIntent
    const ownerId = intent.metadata?.ownerId
    if (!ownerId) {
     
      logger.warn('Payment intent failed but ownerId missing in metadata', { eventId: event.id })
      return
    }

    const ownerObjectId = new mongoose.Types.ObjectId(ownerId)
    try {
      await this._ownerPaymentRepo.createPayment({
        ownerId: ownerObjectId,
        stripePaymentIntentId: intent.id,
        stripeEventId: event.id,
        amount: (intent.amount ?? 0) / 100,
        currency: (intent.currency ?? 'INR').toUpperCase(),
        status: 'FAILED',
      })
      logger.info('Recorded failed payment', { ownerId, eventId: event.id })
    } catch (err) {
      logger.error('Failed to record failed payment', { err, eventId: event.id })
     
    }
  }
}
