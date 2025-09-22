import z, { success } from 'zod'
import { Role } from '../types/role'
import { IUser } from '../interfaces/models/IUser'

export const RequestOtpResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

export type RequestOtpResponseSchema = z.infer<typeof RequestOtpResponseSchema>

export const LoginResponseSchema = z.object({
  accessToken: z.string(),
  role: z.enum(['owner', 'trainer', 'member']),
  userId: z.string(),
})

export type LoginResponseSchema = z.infer<typeof LoginResponseSchema>

export const logoutSchema = z.object({
  message: z.string(),
})

export type logoutSchema = z.infer<typeof logoutSchema>

export const GoogleSchema = LoginResponseSchema

export type GoogleSchema = z.infer<typeof GoogleSchema>

export const ForgetResponseOtpSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  resetToken: z.object({
    resetToken: z.string(),
  }),
})

export type ForgetResponseOtpSchema = z.infer<typeof ForgetResponseOtpSchema>

export const ForgetResponseVerifyOtpSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

export type ForgetResponseVerifyOtpSchema = z.infer<typeof ForgetResponseVerifyOtpSchema>

export const ResetPasswordResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
})

export type ResetPasswordResponseSchema = z.infer<typeof ResetPasswordResponseSchema>
