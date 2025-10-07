import { IUser } from '../../models/common/IUser'
import { Role } from '../../../types/role'
import { Tokens } from '../../../types/auth'

// ------------------------------

export interface ISignupService {
  requestSignup(email: string, role: Role): Promise<void>
  verifySignupOtp(
    email: string,
    otp: string,
    fullName: string,
    password: string,
    role: Role
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>
}

export interface ILoginService {
  login(
    email: string,
    password: string,
    role: Role
  ): Promise<Tokens & { role: Role; userId: string }>
  refreshToken(
    token: string
  ): Promise<{ accessToken: string; userId: string; role: Role; gymId?: string }>
  googleLogin(idToken: string, role: Role): Promise<Tokens & { role: Role; userId: string }>
}

export interface IPasswordResetService {
  forgetOtpRequest(email: string, role: Role): Promise<{ resetToken: string }>
  verifyResetOtp(email: string, otp: string, resetToken: string): Promise<void>
  resetPassword(resetToken: string, password: string, confirmPassword: string): Promise<void>
}

export interface IAuthService extends ISignupService, ILoginService, IPasswordResetService {}
