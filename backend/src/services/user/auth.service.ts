import { injectable, inject } from 'inversify'
import { IUser } from '../../interfaces/models/common/IUser'
import { Role } from '../../types/role'
import { generateAccessToken, generateRefreshToken } from '../../utils/token'
import { IAuthService } from '../../interfaces/services/common/IAuthService'
import { IEmailService } from '../../interfaces/email/IEmailService'
import { IUserRepository } from '../../interfaces/repository/common/IUserRepository'
import { ITokenService, DecodedToken } from '../../interfaces/services/common/ITokenService'
import { IOtpService } from '../../interfaces/otp/IOtpService'
import TYPES from '../../di/types'
import { Tokens } from '../../types/auth'
import { OAuth2Client } from 'google-auth-library'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { IPasswordService } from '../../interfaces/services/common/IPasswordService'
import { MESSAGES } from '../../enums/message.constant'

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

@injectable()
export default class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.TokenService) private _tokenService: ITokenService,
    @inject(TYPES.OtpService) private _otpService: IOtpService,
    @inject(TYPES.EmailService) private _emailService: IEmailService,
    @inject(TYPES.PasswordService) private _passwordService: IPasswordService
  ) {}

  private generateTokens(user: IUser): Tokens & { role: Role; userId: string } {
    const accessToken = generateAccessToken({
      userId: user._id,
      role: user.role,
    })
    const refreshToken = generateRefreshToken({
      userId: user._id,
      role: user.role,
    })
    return { accessToken, refreshToken, role: user.role, userId: String(user._id) }
  }

  //---------------------------------------

  async requestSignup(email: string, role: Role): Promise<void> {
    const existingUser = await this._userRepository.findByEmail(email)

    if (existingUser) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.USER.ALREADY_EXISTS)
    }

    const otp = this._otpService.generateOtp()
    await this._otpService.storeOtp(email, otp)

    try {
      await this._emailService.sendOtp(email, otp, 'signup')
    } catch {
      await this._otpService.deleteOtp(email, otp)
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OTP.FAILED)
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
    const isValid = await this._otpService.verifyOtp(email, otp)

    if (!isValid) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OTP.INVALID)
    }

    const passwordHash = await this._passwordService.hash(password)

    const user: IUser = await this._userRepository.create({
      email,
      fullName,
      passwordHash,
      role,
      isVerified: true,
      isOnboarded: true,
      profileStep: 0,
    })

    const { accessToken, refreshToken } = this.generateTokens(user)

    return { accessToken, refreshToken, user }
  }

  //---------------------------------------

  async login(
    email: string,
    password: string,
    role: Role
  ): Promise<Tokens & { role: Role; userId: string }> {
    const user = await this._userRepository.findByEmail(email)
    if (!user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    if (user.role !== role) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS)
    }

    const isMatch = await this._passwordService.compare(password, user.passwordHash)
    if (!isMatch) throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_CREDENTIALS)

    return this.generateTokens(user)
  }

  //---------------------------------

  async refreshToken(
    token: string
  ): Promise<{ accessToken: string; userId: string; role: Role; gymId?: string }> {
    const decodedRaw = this._tokenService.verifyRefreshToken(token)

    const validRoles: Role[] = ['owner', 'member', 'trainer']
    if (!validRoles.includes(decodedRaw.role as Role)) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.INVALID_ROLE)
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
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.GOOGLETOKEN_INVALID)
    }

    let user = await this._userRepository.findByEmail(payload.email)

    if (user) {
      if (user.role !== role) {
        throw new AppError(
          HttpStatus.FORBIDDEN,
          `This account is registered as ${user.role}. Please login with the correct role.`
        )
      }
    } else {
      user = await this._userRepository.create({
        email: payload.email,
        fullName: payload.name,
        googleId: payload.sub,
        passwordHash: 'google_auth',
        role,
        isVerified: true,
        isOnboarded: true,
        profileStep: 0,
      })
    }

    return this.generateTokens(user)
  }
  //------------------------------------------
  async forgetOtpRequest(email: string, role: Role): Promise<{ resetToken: string }> {
    const existingUser = await this._userRepository.findByEmail(email)

    if (!existingUser) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    }

    if (existingUser.role != role) {
      throw new AppError(HttpStatus.FORBIDDEN, MESSAGES.AUTH.UNAUTHORIZED)
    }

    const otp = this._otpService.generateOtp()

    await this._otpService.storeOtp(email, otp)

    const resetToken = await this._otpService.createResetSession(email, role)

    try {
      await this._emailService.sendOtp(email, otp, 'forget')
    } catch {
      await this._otpService.deleteOtp(email, otp)
      await this._otpService.deleteResetSession(resetToken)
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OTP.FAILED)
    }

    return { resetToken }
  }
  //---------------------------------------
  async verifyResetOtp(email: string, otp: string, resetToken: string): Promise<void> {
    const isValid = await this._otpService.verifyOtp(email, otp)

    if (!isValid) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OTP.FAILED)
    }

    await this._otpService.verifyResetSession(resetToken)
  }
  //-----------------------------
  async resetPassword(resetToken: string, password: string, confimPassword: string): Promise<void> {
    if (password != confimPassword) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.PASSWORD_MISSMATCH)
    }

    const session = await this._otpService.getResetSession(resetToken)

    if (!session || !session.verified) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.AUTH.SESSION_EXPIRED)
    }

    const hashedPassword = await this._passwordService.hash(password)

    await this._userRepository.updatePassword(session.email, hashedPassword)

    await this._otpService.deleteResetSession(resetToken)
  }
}
