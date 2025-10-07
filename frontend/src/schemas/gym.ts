import z from 'zod'

export const GymSchema = z.object({
  name: z.string().min(2, 'Gym name required'),
  contactNo: z.string().min(10, 'Invalid Contact number'),
  website: z.string().optional(),
  address: z.object({
    city: z.string(),
    state: z.string(),
    street: z.string(),
    pincode: z.string(),
  }),
  images: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
})

export type GymFormValues = z.infer<typeof GymSchema>

export const UploadGymResponseSchema = z.object({
  message: z.string(),
  data: z.object({
    gym: z.object({
      _id: z.string(),
      ownerId: z.string(),
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
      createdAt: z.string(),
      updatedAt: z.string(),
    }),
    profile: z
      .object({
        _id: z.string(),
        userId: z.string(),
        gymId: z.string(),
        contactNo: z.string(),
        website: z.string().optional(),
        trainerIds: z.array(z.string()),
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
        subscriptionStart: z.string().optional(),
        subscriptionExpiry: z.string().optional(),
        autoRenew: z.boolean(),
        lastPaymentId: z.string().optional(),
        createdAt: z.string(),
        updatedAt: z.string(),
      })
      .nullable(),
  }),
})

export type UploadGymResponse = z.infer<typeof UploadGymResponseSchema>
