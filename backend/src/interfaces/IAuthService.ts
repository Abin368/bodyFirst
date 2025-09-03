import { Tokens } from '../services/AuthService'
import { Role, IUser } from '../models/User'

export interface IAuthService {
  requestSignup(email: string, role: Role): Promise<void>
  verifySignupOtp(
    email: string,
    otp: string,
    fullName: string,
    password: string,
    role: Role,
    gymId?: string
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }>
  login(email: string, password: string): Promise<Tokens>
  refreshToken(
    token: string
  ): Promise<{ accessToken: string; userId: string; role: Role; gymId?: string }>
}
