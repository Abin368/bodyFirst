import { Document } from 'mongoose'

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
