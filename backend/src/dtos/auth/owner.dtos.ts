import z from 'zod'

export const RequestOwnerSchema = z.object({})

export const GymSchema = z.object({
  name: z.string().min(2, 'Gym name required'),
  contactNo: z.string().min(10, 'Invalid Cuntact number'),
  website: z.string().optional(),
  address: z.object({
    city: z.string(),
    state: z.string(),
    street: z.string(),
    pincode: z.string(),
  }),
  images: z.array(z.string()).optional(),
  services: z.array(z.string()).optional(),
  tempImageKey: z.string().optional(),
})

export type GymSchema = z.infer<typeof GymSchema>


export const CheckoutPaymentSchema = z.object({
  priceId: z.string(),
})

export type CheckoutPaymentSchema = z.infer<typeof CheckoutPaymentSchema>

