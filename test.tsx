import { injectable, inject } from 'inversify';
import Stripe from 'stripe';
import mongoose from 'mongoose';
import TYPES from '../../di/types';
import logger from '../../utils/logger';
import { IOwnerProfileRepository } from '../../interfaces/repository/IOwnerProfileRepository';
import { IOwnerPaymentRepository } from '../../interfaces/repository/IOwnerPaymentRepository';
import { IStripeEventLogRepository } from '../../interfaces/repository/IStripeEventLogRepository';
import { IStripeWebhookService } from '../../interfaces/services/IStripeWebhookService';
import { AppError } from '../../errors/app.error';
import { HttpStatus } from '../../enums/http.status';
import { StripeEventStatus, SubscriptionStatus } from '../../enums/stripe.enums';

type EventHandler = (event: Stripe.Event) => Promise<void>;

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
  private handlers: Record<string, EventHandler>;

  constructor(
    @inject(TYPES.StripeClient) private readonly stripe: Stripe,
    @inject(TYPES.OwnerProfileRepository) private readonly ownerProfileRepo: IOwnerProfileRepository,
    @inject(TYPES.OwnerPaymentRepository) private readonly ownerPaymentRepo: IOwnerPaymentRepository,
    @inject(TYPES.StripeEventLogRepository) private readonly eventLogRepo: IStripeEventLogRepository
  ) {
    this.handlers = {
      'checkout.session.completed': this.handleCheckoutSessionCompleted.bind(this),
      'payment_intent.payment_failed': this.handlePaymentFailed.bind(this),
    };
  }

  async handleWebhook(body: Buffer, signature: string): Promise<void> {
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET as string
      );
    } catch (err: any) {
      logger.error('Stripe signature verification failed', { err });
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid Stripe signature');
    }

    const isNewEvent = await this.eventLogRepo.createIfNotExists(event.id, event.type, StripeEventStatus.PROCESSING);
    if (!isNewEvent) {
      logger.warn('Duplicate Stripe event received', { eventId: event.id });
      return;
    }

    const handler = this.handlers[event.type];
    if (!handler) {
      logger.info('Unhandled Stripe event', { eventId: event.id, type: event.type });
      await this.eventLogRepo.updateStatus(event.id, StripeEventStatus.SUCCESS);
      return;
    }

    try {
      await handler(event);
      await this.eventLogRepo.updateStatus(event.id, StripeEventStatus.SUCCESS);
    } catch (err) {
      logger.error('Error processing Stripe event', { eventId: event.id, err });
      await this.eventLogRepo.updateStatus(
        event.id,
        StripeEventStatus.FAILED,
        err instanceof Error ? err.message : String(err)
      );
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, 'Failed to process Stripe event');
    }
  }

  private async handleCheckoutSessionCompleted(event: Stripe.Event): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;
    const ownerId = session.metadata?.ownerId;
    if (!ownerId) {
      logger.warn('Checkout session missing ownerId', { eventId: event.id });
      return;
    }

    const dbSession = await mongoose.startSession();
    dbSession.startTransaction();

    try {
      const profile = await this.ownerProfileRepo.findByUserId(ownerId);
      if (!profile) throw new Error(`Owner profile not found for ownerId: ${ownerId}`);

      await this.ownerPaymentRepo.createPayment({
        ownerId: profile._id,
        stripeSessionId: session.id,
        stripePaymentIntentId: session.payment_intent as string,
        stripeEventId: event.id,
        amount: ((session.amount_total ?? 0) / 100),
        currency: (session.currency ?? 'INR').toUpperCase(),
        status: StripeEventStatus.SUCCESS,
      }, dbSession);

      await this.ownerProfileRepo.updateByUserId(ownerId, {
        subscriptionStatus: SubscriptionStatus.ACTIVE,
        subscriptionStart: new Date(),
        stripeCustomerId: session.customer as string,
        stripePriceId: session.metadata?.priceId,
      }, dbSession);

      await dbSession.commitTransaction();
      logger.info('Checkout session processed successfully', { ownerId, sessionId: session.id, eventId: event.id });
    } catch (err) {
      await dbSession.abortTransaction();
      logger.error('Failed processing checkout session', { err, eventId: event.id });
      throw err;
    } finally {
      dbSession.endSession();
    }
  }

  private async handlePaymentFailed(event: Stripe.Event): Promise<void> {
    const intent = event.data.object as Stripe.PaymentIntent;
    const ownerId = intent.metadata?.ownerId;
    if (!ownerId) {
      logger.warn('Payment intent failed without ownerId', { eventId: event.id });
      return;
    }

    try {
      await this.ownerPaymentRepo.createPayment({
        ownerId: new mongoose.Types.ObjectId(ownerId),
        stripePaymentIntentId: intent.id,
        stripeEventId: event.id,
        amount: ((intent.amount ?? 0) / 100),
        currency: (intent.currency ?? 'INR').toUpperCase(),
        status: StripeEventStatus.FAILED,
      });
      logger.info('Failed payment recorded', { ownerId, eventId: event.id });
    } catch (err) {
      logger.error('Failed to record payment failure', { err, eventId: event.id });
    }
  }
}
