import { IOwnerPayment } from '../../models/owner/IOwnerPayment'
import { ClientSession } from 'mongoose'

export interface IOwnerPaymentRepository {
  createPayment(payment: Partial<IOwnerPayment>, session?: ClientSession): Promise<IOwnerPayment>
  findByEventId(eventId: string): Promise<IOwnerPayment | null>
}
