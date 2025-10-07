import cron from 'node-cron'
import container from '../di/inversify.config'
import TYPES from '../di/types'
import logger from '../utils/logger'
import { ISubscriptionService } from '../interfaces/services/stripe/ISubscriptionService'

export const subscriptionExpiryCron = (): void => {
  const subscriptionService = container.get<ISubscriptionService>(TYPES.SubscriptionService)

  const CRON_SCHEDULE = process.env.SUBSCRIPTION_CRON || '0 0 * * *'

  cron.schedule(CRON_SCHEDULE, async () => {
    logger.info('[CRON]  Subscription expiry job started')

    try {
      const expiredCount = await subscriptionService.expireSubscriptions()
      logger.info(`[CRON]  Subscription expiry job completed — Expired: ${expiredCount}`)
    } catch (error) {
      logger.error('[CRON] Subscription expiry job failed', error)
    }
  })
}
