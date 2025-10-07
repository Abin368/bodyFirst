import { Document, Types } from 'mongoose'

export interface IOwnerPayment extends Document {
  ownerId: Types.ObjectId
  stripeSessionId: string
  stripePaymentIntentId: string
  stripeEventId: string
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  createdAt: Date
  updatedAt: Date
}
