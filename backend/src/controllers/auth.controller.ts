import { Request, Response } from 'express'
import {
  RequestOtpSchema,
  VerifyOtpSchema,
  LoginSchema,
  ForgetPasswordOtpSchema,
  ForgetPasswordVerifyOtpSchema,
  ResetPasswordSchema,
} from '../dtos/auth/auth.dto'
import { ITokenService } from '../interfaces/services/common/ITokenService'
import { IAuthService } from '../interfaces/services/common/IAuthService'
import { injectable, inject } from 'inversify'
import TYPES from '../di/types'
import { IAuthController } from '../interfaces/controllers/IAuthController'
import { HttpStatus } from '../enums/http.status'
import { AppError } from '../errors/app.error'
import { MESSAGES } from '../enums/message.constant'
import {
  ForgetResponseOtpSchema,
  ForgetResponseVerifyOtpSchema,
  GoogleSchema,
  LoginResponseSchema,
  RequestOtpResponseSchema,
  ResetPasswordResponseSchema,
  logoutSchema,
} from '../dtos/auth/auth.response.dto'

@injectable()
export default class AuthController implements IAuthController {
  constructor(
    @inject(TYPES.AuthService) private readonly _authService: IAuthService,
    @inject(TYPES.TokenService) private readonly _tokenService: ITokenService
  ) {}

  private setRefreshToken(res: Response, refreshToken: string): void {
    const maxAge = Number(process.env.REFRESH_TOKEN_MAX_AGE) || 7 * 24 * 60 * 60 * 1000

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
      maxAge,
    })
  }

  //---------------------------------------------------------
  requestOtp = async (req: Request, res: Response): Promise<Response> => {
    const { email, role } = RequestOtpSchema.parse(req.body)
    await this._authService.requestSignup(email, role)

    const response = RequestOtpResponseSchema.parse({
      success: true,
      message: MESSAGES.OTP.SENT,
    })
    return res.status(HttpStatus.OK).json(response)
  }
  //--------------------------------------------------
  verifyOtp = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp, fullName, password, role } = VerifyOtpSchema.parse(req.body)
    const result = await this._authService.verifySignupOtp(email, otp, fullName, password, role)
    return res.status(HttpStatus.CREATED).json({ message: MESSAGES.OTP.VERIFIED, ...result })
  }
  //---------------------------------------------------
  login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password, role } = LoginSchema.parse(req.body)
    const tokens = await this._authService.login(email, password, role)

    this.setRefreshToken(res, tokens.refreshToken)

    const response = LoginResponseSchema.parse({
      accessToken: tokens.accessToken,
      role: tokens.role,
      userId: tokens.userId,
    })

    return res.status(HttpStatus.OK).json(response)
  }
  //--------------------------------------------
  refreshToken = async (req: Request, res: Response): Promise<Response> => {
    const token = req.cookies.refreshToken
    if (!token) throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)

    const tokens = await this._authService.refreshToken(token)
    return res.status(HttpStatus.OK).json(tokens)
  }
  //-----------------------------------------------------
  logout = async (req: Request, res: Response): Promise<Response> => {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    })

    const response = logoutSchema.parse({
      message: MESSAGES.AUTH.LOGOUT_SUCCESS,
    })

    return res.status(HttpStatus.OK).json(response)
  }
  //--------------------------------------------
  googleLogin = async (req: Request, res: Response): Promise<Response> => {
    const { idToken, role } = req.body
    const tokens = await this._authService.googleLogin(idToken, role)

    this.setRefreshToken(res, tokens.refreshToken)

    const response = GoogleSchema.parse({
      accessToken: tokens.accessToken,
      role: tokens.role,
      userId: tokens.userId,
    })
    return res.status(HttpStatus.OK).json(response)
  }
  //------------------------------------------------------
  forgetOtp = async (req: Request, res: Response) => {
    const { email, role } = ForgetPasswordOtpSchema.parse(req.body)
    const resetToken = await this._authService.forgetOtpRequest(email, role)
    const response = ForgetResponseOtpSchema.parse({
      success: true,
      message: MESSAGES.OTP.SENT,
      resetToken,
    })
    res.status(HttpStatus.OK).json(response)
  }
  //------------------------------------------------------------
  verifyForgetOtp = async (req: Request, res: Response): Promise<Response> => {
    const { email, otp, resetToken } = ForgetPasswordVerifyOtpSchema.parse(req.body)
    await this._authService.verifyResetOtp(email, otp, resetToken)

    const response = ForgetResponseVerifyOtpSchema.parse({
      success: true,
      message: MESSAGES.OTP.VERIFIED,
    })
    return res.status(HttpStatus.CREATED).json(response)
  }

  //---------------------------------------
  resetPassword = async (req: Request, res: Response): Promise<Response> => {
    const { resetToken, password, confirmPassword } = ResetPasswordSchema.parse(req.body)
    await this._authService.resetPassword(resetToken, password, confirmPassword)

    const response = ResetPasswordResponseSchema.parse({
      success: true,
      message: MESSAGES.AUTH.PASSWORD_RESET,
    })
    return res.status(HttpStatus.OK).json(response)
  }
}
