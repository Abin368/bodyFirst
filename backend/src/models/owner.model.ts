import { Schema, model } from 'mongoose'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'

const OwnerProfileSchema = new Schema<IOwnerProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gymId: { type: String, required: true, unique: true },
    gymName: { type: String, required: true, trim: true },

    address: {
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      street: { type: String, required: true },
    },

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
    lastPaymentId: { type: Schema.Types.ObjectId, ref: 'Payment' },
  },
  { timestamps: true }
)

export default model<IOwnerProfile>('OwnerProfile', OwnerProfileSchema)
