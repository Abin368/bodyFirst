import { Document, ObjectId } from 'mongoose'
import {} from 'mongoose'
export interface IOwnerGym extends Document {
  _id: ObjectId
  ownerId: ObjectId
  name: string
  address: {
    city: string
    pincode: string
    state: string
    street: string
  }
  contactNo?: string
  website?: string
  images?: string[]
  logoUrl?: string
  createdAt: Date
  updatedAt: Date
}
