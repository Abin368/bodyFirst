import { Request, Response } from 'express'
import { inject, injectable } from 'inversify'
import TYPES from '../di/types'
import { IStripeWebhookService } from '../interfaces/services/IStripeWebhookService'
import { HttpStatus } from '../enums/http.status'
import { AppError } from '../errors/app.error'
import { MESSAGES } from '../enums/message.constant'
import { WebhookResponseSchema } from '../dtos/owner/webhook.response.dtos'
import logger from '../utils/logger'

@injectable()
export class StripeWebhookController {
  private readonly STRIPE_SIGNATURE_HEADER = 'stripe-signature' as const

  constructor(
    @inject(TYPES.StripeWebhookService)
    private readonly _stripeWebhookService: IStripeWebhookService
  ) {}

  webhook = async (req: Request, res: Response): Promise<Response> => {
    const signature = req.get(this.STRIPE_SIGNATURE_HEADER)

    if (!signature) {
      logger.warn('Missing Stripe signature header')
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.STRIPE.INVALID_SIGNATURE)
    }

    const body = req.body as Buffer
    if (!body || !(body instanceof Buffer)) {
      logger.warn('Invalid or missing request body for Stripe webhook')
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.STRIPE.INVALID_PAYLOAD)
    }

    logger.info('Processing Stripe webhook')
    await this._stripeWebhookService.handleWebhook(body, signature)

    const response = WebhookResponseSchema.parse({
      message: MESSAGES.STRIPE.WEBHOOK_RECEIVED,
      received: true,
    })

    return res.status(HttpStatus.OK).json(response)
  }
}
