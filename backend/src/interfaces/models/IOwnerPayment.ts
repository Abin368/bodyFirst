import { Document, ObjectId } from 'mongoose'

export interface IOwnerPayment extends Document {
  ownerId: ObjectId
  razorpayOrderId: string
  razorpayPaymentId?: string
  razorpaySignature?: string
  amount: number
  currency: string
  status: 'PENDING' | 'SUCCESS' | 'FAILED'
  createdAt: Date
  updatedAt: Date
}
