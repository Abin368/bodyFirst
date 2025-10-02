import { Schema, model } from 'mongoose'
import { IOwnerPayment } from '../../interfaces/models/IOwnerPayment'

const OwnerPaymentSchema = new Schema<IOwnerPayment>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'OwnerProfile', required: true },

    stripeSessionId: { type: String, index: true },
    stripePaymentIntentId: { type: String, index: true },
    stripeEventId: { type: String, index: true, unique: true }, 

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

export default model<IOwnerPayment>('OwnerPayment', OwnerPaymentSchema)
