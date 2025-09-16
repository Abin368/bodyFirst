import { Request, Response } from 'express'
import {
  RequestOtpSchema,
  VerifyOtpSchema,
  LoginSchema,
  ForgetPasswordOtpSchema,
  ForgetPasswordVerifyOtpSchema,
  ResetPasswordSchema,
} from '../dtos/auth.dto'
import { ITokenService } from '../interfaces/services/ITokenService'
import { IAuthService } from '../interfaces/services/IAuthService'
import { injectable, inject } from 'inversify'
import TYPES from '../di/types'
import { IAuthController } from '../interfaces/controllers/IAuthController'
import { HttpStatus } from '../enums/httpStatus'
import { AppError } from '../errors/AppError'

@injectable()
export default class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly _authService: IAuthService,
    @inject(TYPES.TokenService) private readonly _tokenService: ITokenService
  ) {}

  private setRefreshToken(res: Response, refreshToken: string): void {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
  }

  //---------------------------------------------------------
  requestOtp = async (req: Request, res: Response): Promise<void> => {
    const body = RequestOtpSchema.parse(req.body)
    await this._authService.requestSignup(body.email, body.role)
    res.status(HttpStatus.OK).json({ success: true, message: 'OTP sent successfully' })
  }
  //--------------------------------------------------
  verifyOtp = async (req: Request, res: Response): Promise<void> => {
    const body = VerifyOtpSchema.parse(req.body)
    const result = await this._authService.verifySignupOtp(
      body.email,
      body.otp,
      body.fullName,
      body.password,
      body.role
    )
    res.status(HttpStatus.CREATED).json({ message: 'OTP verified Successfully', ...result })
  }
  //---------------------------------------------------
  login = async (req: Request, res: Response): Promise<void> => {
    const body = LoginSchema.parse(req.body)
    const tokens = await this._authService.login(body.email, body.password, body.role)

    this.setRefreshToken(res, tokens.refreshToken)

    res.status(HttpStatus.OK).json({
      accessToken: tokens.accessToken,
      role: tokens.role,
      userId: tokens.userId,
    })
  }
  //--------------------------------------------
  refreshToken = async (req: Request, res: Response): Promise<void> => {
    const token = req.cookies.refreshToken
    if (!token) throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized')

    const tokens = await this._authService.refreshToken(token)
    res.status(HttpStatus.OK).json(tokens)
  }
  //-----------------------------------------------------
  logout = async (req: Request, res: Response): Promise<void> => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })
    res.status(HttpStatus.OK).json({ message: 'Logged out succesfully' })
  }
  //--------------------------------------------
  googleLogin = async (req: Request, res: Response): Promise<void> => {
    const { idToken, role } = req.body
    const tokens = await this._authService.googleLogin(idToken, role)

    this.setRefreshToken(res, tokens.refreshToken)

    res.status(HttpStatus.OK).json({
      accessToken: tokens.accessToken,
      role: tokens.role,
      userId: tokens.userId,
    })
  }
  //------------------------------------------------------
  forgetOtp = async (req: Request, res: Response) => {
    const body = ForgetPasswordOtpSchema.parse(req.body)
    const resetToken = await this._authService.forgetOtpRequest(body.email, body.role)
    res.status(HttpStatus.OK).json({ success: true, message: 'OTP sent successfully', resetToken })
  }
  //------------------------------------------------------------
  verifyForgetOtp = async (req: Request, res: Response): Promise<void> => {
    const body = ForgetPasswordVerifyOtpSchema.parse(req.body)
    await this._authService.verifyResetOtp(body.email, body.otp, body.resetToken)
    res.status(HttpStatus.CREATED).json({ success: true, message: 'OTP verified successfully' })
  }

  //---------------------------------------
  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const body = ResetPasswordSchema.parse(req.body)
    await this._authService.resetPassword(body.resetToken, body.password, body.confirmPassword)
    res.status(HttpStatus.OK).json({ success: true, message: 'Password reset successful' })
  }
}
