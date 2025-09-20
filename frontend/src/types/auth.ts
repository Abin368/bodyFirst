export type UserRole = 'owner' | 'trainer' | 'member'

export interface AuthFormProps {
  role: UserRole
}

export interface ResetOtpState {
  email: string
  role: UserRole
}

export interface VerifyOtpState {
  email: string
  role: UserRole
  fullName: string
  password: string
}

export interface SignupRequestData {
  email: string
  role: string
}

export interface SignupVerifyData {
  email: string
  otp: string
  fullName: string
  password: string
  role: string
}
