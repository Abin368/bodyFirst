import mongoose, { Schema } from 'mongoose'
import { IUser } from '../interfaces/models/IUser'

const UserSchema: Schema<IUser> = new Schema(
  {
    gymId: {
      type: String,
      required: false,
    },

    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    role: {
      type: String,
      enum: ['owner', 'trainer', 'member', 'admin'],
      default: 'member',
    },
    isActive: { type: Boolean, default: true },
    imageUrl: { type: String },
    googleId: {
      type: String,
      required: false,
    },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'] },
    isVerified: { type: Boolean, default: false },
    isOnboarded: { type: Boolean, default: false },
    profileStep: { type: Number, default: 1 },
    dob: { type: Date },
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)
