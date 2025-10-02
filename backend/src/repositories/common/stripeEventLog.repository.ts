
import { injectable } from 'inversify'
import StripeEventLogModel from '../../models/common/stripeEventLog.model'
import { IStripeEventLogRepository } from '../../interfaces/repository/IStripeEventLogRepository'

@injectable()
export class StripeEventLogRepository implements IStripeEventLogRepository {
  async createIfNotExists(eventId: string, type: string, status: 'PROCESSING'|'SUCCESS'|'FAILED'): Promise<boolean> {
    try {
    
      const res = await StripeEventLogModel.findOneAndUpdate(
        { eventId },
        { $setOnInsert: { eventId, type, status, processedAt: new Date() } },
        { upsert: true, new: false } 
      ).exec()
     
      return res === null
    } catch (err) {
     
      return false
    }
  }

  async updateStatus(eventId: string, status: 'PROCESSING'|'SUCCESS'|'FAILED', errorMessage?: string): Promise<void> {
    await StripeEventLogModel.findOneAndUpdate(
      { eventId },
      { status, error: errorMessage ?? null, processedAt: new Date() },
      { upsert: false }
    ).exec()
  }

  async isProcessed(eventId: string): Promise<boolean> {
    const doc = await StripeEventLogModel.findOne({ eventId }).exec()
    return !!doc
  }
}
