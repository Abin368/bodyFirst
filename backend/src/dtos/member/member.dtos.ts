import z from 'zod'
import { ObjectId } from 'mongodb'

export const ObjectIdSchema = z.instanceof(ObjectId).transform((id) => id.toHexString())

export const DateStringSchema = z.date().transform((d) => d.toISOString())

// Member Profile Create Schema
export const MemberSchema = z.object({
  contactNo: z.string().min(10, 'Invalid Contact number'),
  address: z.object({
    street: z.string(),
    city: z.string(),
    district: z.string(),
    state: z.string(),
    pincode: z.string(),
    country: z.string(),
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  age: z.number(),
  heightCm: z.number(),
  weightKg: z.number(),
  activityLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  preference: z
    .object({
      goal: z.string(),
      trainingStyle: z.string(),
    })
    .optional(),
  images: z.array(z.string()).optional(),
  tempImageKey: z.string().optional(),
})

export type MemberSchemaType = z.infer<typeof MemberSchema>

// Gym Address Reusable Schema
export const GymAddressSchema = z.object({
  street: z.string(),
  city: z.string(),
  district: z.string(),
  state: z.string(),
  pincode: z.string(),
})

// Get Profile Response
export const GetProfileResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    _id: ObjectIdSchema,
    userId: ObjectIdSchema,
    gymId: ObjectIdSchema.nullable(),
    contactNo: z.string(),
    address: GymAddressSchema,
    status: z.enum(['PENDING', 'ACTIVE', 'REJECTED']),
    gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
    age: z.number(),
    heightCm: z.number(),
    weightKg: z.number(),
    activityLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
    preference: z
      .object({
        goal: z.string(),
        trainingStyle: z.string(),
      })
      .optional(),
    images: z.array(z.string()).optional(),
    joinDate: DateStringSchema.optional(),
    lastActiveAt: DateStringSchema.optional(),
    createdAt: DateStringSchema,
    updatedAt: DateStringSchema,
  }),
})

export const UploadMemberResponseSchema = z.object({
  message: z.string(),
  data: GetProfileResponseSchema.shape.data,
})

export type UploadMemberResponseType = z.infer<typeof UploadMemberResponseSchema>

// Upload Image Response
export const UploadImgResponseSchema = z.object({
  message: z.string(),
  url: z.string().url(),
  key: z.string(),
})

export type UploadImgResponseType = z.infer<typeof UploadImgResponseSchema>
