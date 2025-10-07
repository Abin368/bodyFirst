import { z } from 'zod'

export const MemberProfileSchema = z.object({
  contactNo: z
    .string()
    .min(10, 'Contact number must be at least 10 digits')
    .regex(/^\d+$/, 'Contact number must contain only digits'),
  address: z.object({
    street: z.string(),
    city: z.string(),
    district: z.string(),
    state: z.string(),
    pincode: z.string(),
  }),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
  age: z.number().min(10, 'Age is required'),
  heightCm: z.number().min(50, 'Height is required'),
  weightKg: z.number().min(20, 'Weight is required'),
  activityLevel: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  images: z.array(z.string()).optional(),
})

export type MemberProfileFormValues = z.infer<typeof MemberProfileSchema>
