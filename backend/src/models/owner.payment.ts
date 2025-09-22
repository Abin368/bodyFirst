import { Schema, model } from 'mongoose'
import { IOwnerPayment } from '../interfaces/models/IOwnerPayment'

const OwnerPayentSchema = new Schema<IOwnerPayment>(
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

export default model<IOwnerPayment>('OwnerPayment', OwnerPayentSchema)
