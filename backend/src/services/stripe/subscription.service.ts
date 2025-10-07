import mongoose from 'mongoose'

import logger from '../../utils/logger'
import { IOwnerProfile } from '../../interfaces/models/owner/IOwnerProfile'

import { inject, injectable } from 'inversify'
import TYPES from '../../di/types'
import { IOwnerProfileRepository } from '../../interfaces/repository/owner/IOwnerProfileRepository'
import { IOwnerGymRepository } from '../../interfaces/repository/owner/IOwnerGymRepository'
import { ISubscriptionService } from '../../interfaces/services/stripe/ISubscriptionService'

@injectable()
export default class SubscriptionService implements ISubscriptionService {
  constructor(
    @inject(TYPES.OwnerProfileRepository)
    private readonly _ownerProfileRepo: IOwnerProfileRepository,
    @inject(TYPES.OwnerGymRepository) private readonly _ownerGymRepository: IOwnerGymRepository
  ) {}

  async expireSubscriptions(): Promise<number> {
    const session = await mongoose.startSession()
    session.startTransaction()
    let expiredCount = 0

    try {
      const now = new Date()

      const expiredProfiles: IOwnerProfile[] = await this._ownerProfileRepo.findMany(
        { subscriptionStatus: 'ACTIVE', subscriptionExpiry: { $lt: now } },
        session
      )

      for (const profile of expiredProfiles) {
        await this._ownerProfileRepo.updateByUserId(
          profile.userId.toString(),
          { subscriptionStatus: 'EXPIRED' },
          session
        )

        await this._ownerGymRepository.updateMany(
          { ownerId: profile.userId, status: 'ACTIVE' },
          { status: 'EXPIRED' },
          session
        )

        expiredCount++
      }

      await session.commitTransaction()
      logger.info(`Expired ${expiredCount} subscriptions successfully`)
      return expiredCount
    } catch (err) {
      logger.error('Failed to expire subscriptions', err)
      throw err
    } finally {
      session.endSession()
    }
  }
}
