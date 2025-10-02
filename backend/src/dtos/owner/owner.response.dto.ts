import z from 'zod'
import { ObjectId } from 'mongodb'

export const ObjectIdSchema = z.instanceof(ObjectId).transform((id) => id.toHexString())

export const DateStringSchema = z.date().transform((d) => d.toISOString())

export const GetProfileResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    _id: ObjectIdSchema,
    userId: ObjectIdSchema,
    gymId: ObjectIdSchema,
    contactNo: z.string(),
    website: z.string().optional(),
    trainerIds: z.array(ObjectIdSchema),
    numberOfTrainers: z.number(),
    services: z.array(z.string()),
    plans: z.array(
      z.object({
        name: z.string().optional(),
        price: z.number().optional(),
        duration: z.number().optional(),
      })
    ),
    subscriptionStatus: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']),
    subscriptionStart: DateStringSchema.optional(),
    subscriptionExpiry: DateStringSchema.optional(),
    autoRenew: z.boolean(),
    lastPaymentId: ObjectIdSchema.optional(),
    createdAt: DateStringSchema,
    updatedAt: DateStringSchema,
  }),
})

export type GetProfileResponse = z.infer<typeof GetProfileResponseSchema>

export const UploadImgResponseSchema = z.object({
  message: z.string(),
  url: z.string().url(),
  key: z.string(),
})

export type UploadImgResponse = z.infer<typeof UploadImgResponseSchema>

const gymResponseSchema = z.object({
  _id: ObjectIdSchema,
  ownerId: ObjectIdSchema,
  name: z.string(),
  address: z.object({
    city: z.string(),
    state: z.string(),
    street: z.string(),
    pincode: z.string(),
  }),
  contactNo: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  images: z.array(z.string()),
  createdAt: DateStringSchema,
  updatedAt: DateStringSchema,
})

const profileResponseSchema = z.object({
  _id: ObjectIdSchema,
  userId: ObjectIdSchema,
  gymId: ObjectIdSchema,
  contactNo: z.string(),
  website: z.string().optional(),
  trainerIds: z.array(ObjectIdSchema),
  numberOfTrainers: z.number(),
  services: z.array(z.string()),
  plans: z.array(
    z.object({
      name: z.string().optional(),
      price: z.number().optional(),
      duration: z.number().optional(),
    })
  ),
  subscriptionStatus: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']),
  subscriptionStart: DateStringSchema.optional(),
  subscriptionExpiry: DateStringSchema.optional(),
  autoRenew: z.boolean(),
  lastPaymentId: ObjectIdSchema.optional(),
  createdAt: DateStringSchema,
  updatedAt: DateStringSchema,
})

export const UploadGymResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    gym: gymResponseSchema,
    profile: profileResponseSchema,
  }),
})

export type UploadGymResponse = z.infer<typeof UploadGymResponseSchema>


export const CheckoutPaymentResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    checkoutUrl: z.string(),
  }),
  
})

export type CheckoutPaymentResponseSchema = z.infer<typeof CheckoutPaymentResponseSchema>