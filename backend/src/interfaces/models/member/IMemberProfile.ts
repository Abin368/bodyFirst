import { Document, ObjectId, Types } from 'mongoose'

export interface IMemberProfile extends Document {
  _id: ObjectId
  userId: Types.ObjectId
  gymId?: Types.ObjectId | null
  contactNo: string
  address: {
    street: string
    city: string
    district: string
    state: string
    pincode: string
  }
  status: 'PENDING' | 'ACTIVE' | 'REJECTED'
  joinDate?: Date
  gender: 'MALE' | 'FEMALE' | 'OTHER'
  age: number
  heightCm: number
  weightKg: number
  activityLevel: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED'
  prference: {
    goal: string
    trainingStyle: string
  }
  images: string[]
  lastActiveAt?: Date
  createdAt: Date
  updatedAt: Date
}
