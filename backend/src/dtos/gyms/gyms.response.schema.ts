import { z } from 'zod'
import { ObjectId } from 'mongodb'

export const ObjectIdSchema = z.instanceof(ObjectId).transform((id) => id.toHexString())

export const DateStringSchema = z.date().transform((d) => d.toISOString())

export const GymAddressSchema = z.object({
  street: z.string(),
  pincode: z.string(),
  state: z.string(),
  city: z.string(),
})

export const GymSchema = z.object({
  _id: ObjectIdSchema,
  ownerId: ObjectIdSchema,
  name: z.string(),
  address: GymAddressSchema,
  status: z.enum(['ACTIVE', 'INACTIVE', 'EXPIRED']),
  contactNo: z.string().optional(),
  website: z.string().optional(),
  logoUrl: z.string().optional(),
  images: z.array(z.string()),
  createdAt: DateStringSchema,
  updatedAt: DateStringSchema,
})

export const GymListResponseSchema = z
  .object({
    message: z.string().min(1, 'Message is required'),
    data: z.array(GymSchema).min(0, 'Data must be an array'),
    total: z.number().int().min(0, 'Total must be a non-negative integer'),
    page: z.number().int().min(1, 'Page must be at least 1'),
    totalPages: z.number().int().min(0, 'Total pages must be a non-negative integer'),
  })
  .strict()

export type GymListResponseSchema = z.infer<typeof GymListResponseSchema>
