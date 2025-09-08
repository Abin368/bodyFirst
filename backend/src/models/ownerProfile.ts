import { Schema, Document } from 'mongoose'
import mongoose from 'mongoose'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'

const OwnerProfileSchema: Schema<IOwnerProfile> = new Schema(
  {
    userId: { type: String, required: true },
    gymName: { type: String, required: true, trim: true },
    address: {
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      street: { type: String, required: true },
    },
    contactNo: { type: Number },
    website: { type: String },
    plans: [{ type: String }],
    trainerid: [{ type: String }],
    services: [{ type: String }],
    numberOfTrainers: { type: Number },
  },
  { timestamps: true }
)

export default mongoose.model<IOwnerProfile>('OwnerProfile', OwnerProfileSchema)
