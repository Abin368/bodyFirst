import { Tokens } from '../../types/auth';
import { Role } from '../../types/role';
import { IUser } from '../models/IUser';

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
  login(email: string, password: string,role:Role): Promise<Tokens>
  refreshToken(
    token: string
  ): Promise<{ accessToken: string; userId: string; role: Role; gymId?: string }>
   
  googleLogin(idToken: string, role: Role): Promise<{
    accessToken: string
    refreshToken: string
    role: Role
    userId: string
  }>
}
