import bcrypt from 'bcryptjs'
import { injectable, inject } from 'inversify'
import { IUser } from '../interfaces/models/IUser'
import { Role } from '../types/role'
import { generateAccessToken, generateRefreshToken } from '../utils/token'
import { IAuthService } from '../interfaces/services/IAuthService'
import { IEmailService } from '../interfaces/email/IEmailService'
import { IUserRepository } from '../interfaces/user/IUserRepository'
import { ITokenService, DecodedToken } from '../interfaces/services/ITokenService'
import { IOtpService } from '../interfaces/otp/IOtpService'
import TYPES from '../di/types'
import { Tokens } from '../types/auth'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.TokenService) private _tokenService: ITokenService,
    @inject(TYPES.OtpService) private _otpService: IOtpService,
    @inject(TYPES.EmailService) private _emailService: IEmailService
  ) { }
  //---------------------------------------

  async requestSignup(email: string, role: Role): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(email)

    if (existingUser) {
      throw new Error('User already exists')
    }

    const otp = this._otpService.generateOtp()
    await this._otpService.storeOtp(email, otp)

    try {
      await this._emailService.sendOtp(email, otp)
    } catch (error) {
      console.log('Email sending failed:', error)

      await this._otpService.deleteOtp(email, otp)
      throw new Error('Failed to send OTP')
    }
  }

  //------------------------------------

  async verifySignupOtp(
    email: string,
    otp: string,
    fullName: string,
    password: string,
    role: Role
  ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {
    const isValid = await this._otpService.verifyOtp(email, otp);

    if (!isValid) {
      throw new Error('Invalid or expired OTP');
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user: IUser = await this._userRepository.create({
      email,
      fullName,
      passwordHash,
      role,
      isVerified: true,
      isOnboarded: true,
      profileStep: 0,
    });

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      gymId: user.gymId,
    });
    const refreshToken = generateRefreshToken({ userId: user._id });

    return { accessToken, refreshToken, user };
  }

  //---------------------------------------

  async login(email: string, password: string, role: Role): Promise<Tokens & { role: Role; userId: string }> {
    const user = await this._userRepository.findByEmail(email)
    if (!user) throw new Error('Invalid credentials')


    if (user.role !== role) throw new Error('Invalid credentials')

    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) throw new Error('Invalid credentials')

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      gymId: user.gymId,
    })
    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
      gymId: user.gymId,
    })

    return { accessToken, refreshToken, role: user.role, userId: String(user._id) }
  }

  //---------------------------------

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; userId: string; role: Role; gymId?: string }> {
    const decodedRaw = this._tokenService.verifyRefreshToken(token)

    const validRoles: Role[] = ['owner', 'member', 'trainer']
    if (!validRoles.includes(decodedRaw.role as Role)) {
      throw new Error('Invalid role in token')
    }

    const decoded: DecodedToken = {
      userId: decodedRaw.userId,
      role: decodedRaw.role as Role,
      gymId: decodedRaw.gymId,
    }

    const accessToken = this._tokenService.generateAccessToken(decoded)

    return {
      accessToken,
      userId: decoded.userId,
      role: decoded.role,
      gymId: decoded.gymId,
    }
  }
  //-------------------------------------

  async googleLogin(
    idToken: string,
    role: Role
  ): Promise<{ accessToken: string; refreshToken: string; role: Role; userId: string }> {

    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload || !payload.email) {
      throw new Error("Invalid Google token")
    }

    let user = await this._userRepository.findByEmail(payload.email)

    if (user) {
      if (user.role !== role) {
        throw new Error(`This account is registered as ${user.role}. Please login with the correct role.`)
      }
    } else {
      
      user = await this._userRepository.create({
        email: payload.email,
        fullName: payload.name,
        googleId: payload.sub,
        role,
        isVerified: true,
        isOnboarded: true,
        profileStep: 0,
      })
    }

    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
      gymId: user.gymId
    })

    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
      gymId: user.gymId,
    })

    return {
      accessToken,
      refreshToken,
      role: user.role,
      userId: String(user._id),
    }
  }

}
