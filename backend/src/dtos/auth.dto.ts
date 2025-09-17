
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
  role: z.enum(['owner', 'member', 'trainer']),
})

export type LoginSchema = z.infer<typeof LoginSchema>

export const ForgetPasswordOtpSchema = z.object({
  email: z.string().email(),
  role: z.enum(['owner', 'member', 'trainer']),
})

export type ForgetPasswordOtpSchema = z.infer<typeof ForgetPasswordOtpSchema>

export const ForgetPasswordVerifyOtpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6),
  resetToken: z.string(),
})

export type ForgetPasswordVerifyOtpSchema = z.infer<typeof ForgetPasswordVerifyOtpSchema>

export const ResetPasswordSchema = z
  .object({
    resetToken: z.string(),
    password: z.string().min(8, 'Passwords must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  })

export type resetPasswordSchema = z.infer<typeof ResetPasswordSchema>
