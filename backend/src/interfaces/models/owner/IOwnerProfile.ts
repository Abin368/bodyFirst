import { Document, ObjectId } from 'mongoose'
import mongoose from 'mongoose'

export interface IOwnerProfile extends Document {
  _id: ObjectId
  userId: mongoose.Types.ObjectId
  gymId: mongoose.Types.ObjectId

  contactNo: string
  website?: string

  // Gym setup
  trainerIds?: ObjectId[]
  numberOfTrainers?: number
  services?: string[]
  plans?: { name?: string; price?: number; duration?: number }[]

  // Subscription
  subscriptionStatus: 'ACTIVE' | 'INACTIVE' | 'EXPIRED'
  subscriptionStart?: Date
  subscriptionExpiry?: Date
  autoRenew?: boolean
  lastPaymentId?: ObjectId

  stripeCustomerId?: string
  stripeSubscriptionId?: string
  stripePriceId?: string

  createdAt: Date
  updatedAt: Date
}
