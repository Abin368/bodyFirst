import { Document } from 'mongoose'
import { Role } from '../../types/role'

export interface IUser extends Document {
  fullName: string
  phone: string
  role: Role
  isActive: boolean
  imageUrl?: string
  googleId?: string
  email: string
  passwordHash: string
  gender?: 'male' | 'female' | 'other'
  isVerified: boolean
  isOnboarded: boolean
  profileStep: number
  dob?: Date
  createdAt: Date
  updatedAt: Date
}
