import { Schema, Document } from 'mongoose'
import mongoose from 'mongoose'

export interface IOwnerProfile extends Document {
  userId: string
  gymName: string
  address?: {
    city: string
    pincode: string
    state: string
    street: string
  }
  contactNo: number
  website: string
  plans: string[]
  trainerid: string[]
  services: string[]
  numberOfTrainers: number
  createdAt: Date
  updatedAt: Date
}

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
