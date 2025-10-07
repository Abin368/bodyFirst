import mongoose, { Document } from 'mongoose'
import {} from 'mongoose'
export interface IOwnerGym extends Document {
  _id: mongoose.Types.ObjectId
  ownerId: mongoose.Types.ObjectId
  name: string
  address: {
    city: string
    pincode: string
    state: string
    street: string
  }
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  contactNo?: string
  website?: string
  images?: string[]
  logoUrl?: string
  createdAt: Date
  updatedAt: Date
}
