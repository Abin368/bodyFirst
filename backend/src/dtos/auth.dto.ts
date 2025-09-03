import z from 'zod'

export const RequestOtpSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'member', 'trainer']),
})

export type RequestOtpSchema = z.infer<typeof RequestOtpSchema>

export const VerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  fullName: z.string().min(2),
  password: z.string().min(6),
  role: z.enum(['owner', 'member', 'trainer']),
})

export type VerifyOtpSchema = z.infer<typeof VerifyOtpSchema>

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

export type LoginSchema = z.infer<typeof LoginSchema>
