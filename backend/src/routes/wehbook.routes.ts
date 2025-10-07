import { Router } from 'express'
import express from 'express'
import container from '../di/inversify.config'
import TYPES from '../di/types'
import { StripeWebhookController } from '../controllers/stripe.webhook.controller'
import { ROUTES } from '../enums/routes.constant'
const router = Router()
const stripeWebhookController = container.get<StripeWebhookController>(
  TYPES.StripeWebhookController
)

router.post(
  ROUTES.STRIPE.STRIPE_WEBHOOK,
  express.raw({ type: 'application/json' }),
  stripeWebhookController.webhook
)

export default router
