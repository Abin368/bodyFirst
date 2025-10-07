import { Schema, model } from 'mongoose'
import { IMemberProfile } from '../../interfaces/models/member/IMemberProfile'

const MemberProfileSchema = new Schema<IMemberProfile>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    gymId: {
      type: Schema.Types.ObjectId,
      ref: 'OwnerGym',
      default: null,
    },
    contactNo: { type: String },
    address: {
      street: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    status: {
      type: String,
      enum: ['PENDING', 'ACTIVE', 'REJECTED'],
      default: 'PENDING',
    },
    joinDate: { type: Date },
    gender: {
      type: String,
      enum: ['MALE', 'FEMALE', 'OTHER'],
      default: 'MALE',
    },
    age: { type: Number },
    heightCm: { type: Number },
    weightKg: { type: Number },
    activityLevel: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
      default: 'BEGINNER',
    },
    prference: {
      goal: { type: String },
      trainingStyle: { type: String },
    },
    images: [{ type: String }],
    lastActiveAt: { type: Date },
  },
  { timestamps: true }
)

export default model<IMemberProfile>('MemberProfile', MemberProfileSchema)
