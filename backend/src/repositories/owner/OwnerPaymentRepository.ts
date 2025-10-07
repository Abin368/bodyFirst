import { injectable } from 'inversify'
import { IOwnerPaymentRepository } from '../../interfaces/repository/owner/IOwnerPaymentRepository'
import { IOwnerPayment } from '../../interfaces/models/owner/IOwnerPayment'
import ownerPayment from '../../models/owner/owner.payment'
import { BaseRepository } from '../common/base.repository'
import { ClientSession } from 'mongoose'

@injectable()
export class OwnerPaymentRepository
  extends BaseRepository<IOwnerPayment>
  implements IOwnerPaymentRepository
{
  constructor() {
    super(ownerPayment)
  }

  async createPayment(
    payment: Partial<IOwnerPayment>,
    session?: ClientSession
  ): Promise<IOwnerPayment> {
    const doc = new this.model(payment)
    return await doc.save({ session })
  }

  async findByEventId(eventId: string): Promise<IOwnerPayment | null> {
    return this.model.findOne({ stripeEventId: eventId }).exec()
  }
}
