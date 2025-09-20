import { Schema, model } from 'mongoose'
import { IOwnerPaymnt } from '../interfaces/models/IOwnerPayment'

const OwnerPayentSchema = new Schema<IOwnerPaymnt>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'OwnerProfile', required: true },
    razorpayOrderId: { type: String, required: true },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
    },
  },
  { timestamps: true }
)

export default model<IOwnerPaymnt>('OwnerPayment', OwnerPayentSchema)
