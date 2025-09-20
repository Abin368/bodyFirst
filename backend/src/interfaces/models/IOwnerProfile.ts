import { Document, ObjectId } from 'mongoose'

export interface IOwnerProfile extends Document {
  _id: ObjectId
  userId: ObjectId
  gymId: string
  gymName: string
  address?: {
    city: string
    pincode: string
    state: string
    street: string
  }
  contactNo: string
  website?: string

  // Gym setup
  trainerIds: ObjectId[]
  numberOfTrainers: number
  services: string[]
  plans: { name: string; price: number; duration: number }[]

  // Subscription
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  subscriptionStart: Date
  subscriptionExpiry: Date
  autoRenew?: boolean
  lastPaymentId?: ObjectId

  createdAt: Date
  updatedAt: Date
}
