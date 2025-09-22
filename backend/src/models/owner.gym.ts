import { IOwnerGym } from '../interfaces/models/IOwnerGym'
import { Schema, model } from 'mongoose'

const OwnerGymSchema = new Schema<IOwnerGym>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: 'OwnerProfile', required: true },
    name: { type: String, required: true, trim: true },
    address: {
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      state: { type: String, required: true },
      street: { type: String, required: true },
    },
    contactNo: { type: String },
    website: { type: String },
    logoUrl: { type: String },
    images: [{ type: String }],
  },
  { timestamps: true }
)

export default model<IOwnerGym>('OwnerGym', OwnerGymSchema)
