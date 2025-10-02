import { Schema, model } from 'mongoose'
import { IOwnerProfile } from '../../interfaces/models/IOwnerProfile'

const OwnerProfileSchema = new Schema<IOwnerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gymId: { type: Schema.Types.ObjectId, ref: 'OwnerGym' },

    contactNo: { type: String, required: true },
    website: { type: String },

    trainerIds: [{ type: Schema.Types.ObjectId, ref: 'Trainer' }],
    numberOfTrainers: { type: Number, default: 0 },

    services: [{ type: String }],
    plans: [
      {
        name: { type: String },
        price: { type: Number },
        duration: { type: Number },
      },
    ],

    subscriptionStatus: {
      type: String,
      enum: ['ACTIVE', 'INACTIVE', 'EXPIRED'],
      default: 'INACTIVE',
    },
    subscriptionStart: { type: Date },
    subscriptionExpiry: { type: Date },
    autoRenew: { type: Boolean, default: false },

    lastPaymentId: { type: Schema.Types.ObjectId, ref: 'OwnerPayment' },

  
    stripeCustomerId: { type: String, index: true },
    stripeSubscriptionId: { type: String, index: true },
    stripePriceId: { type: String },
  },
  { timestamps: true }
)

export default model<IOwnerProfile>('OwnerProfile', OwnerProfileSchema)
