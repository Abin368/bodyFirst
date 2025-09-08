import { Request, Response ,NextFunction} from 'express'
import { Role } from '../types/role'
import { RequestOtpSchema, VerifyOtpSchema, LoginSchema } from '../dtos/auth.dto'
import {  ITokenService } from '../interfaces/services/ITokenService'
import { IAuthService } from '../interfaces/services/IAuthService'
import { ZodError } from 'zod'
import { HttpStatus } from '../enums/httpStatus'
import { injectable,inject } from 'inversify'
import TYPES from '../di/types'
import { IAuthController } from '../interfaces/controllers/IAuthController'

import { IUser } from '../interfaces/models/IUser'


@injectable()
export default class AuthController implements IAuthController {
  constructor(   
    @inject(TYPES.AuthService) private readonly _authService: IAuthService,
    @inject(TYPES.TokenService) private readonly _tokenService: ITokenService
  ) {}
   
  
  //--------------------------------

  requestOtp = async (req: Request, res: Response):Promise<void> => {
    try {
      const body = RequestOtpSchema.parse(req.body)

      await this._authService.requestSignup(body.email, body.role)

       res.status(HttpStatus.OK).json({ success: true, message: 'OTP sent successfully' })
    } catch (error: unknown) {
  
  if (error instanceof Error) {
    console.log('Controller error:', error.message);

    if (error.message === 'User already exists') {
       res.status(HttpStatus.BAD_REQUEST).json({ success: false, message: 'User already exists' });
       return
    }

    if (error.message === 'Failed to send OTP') {
       res
        .status(HttpStatus.BAD_REQUEST)
        .json({ success: false, message: 'Failed to send OTP. Please try again.' });
        return
    }

     res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: error.message });
     return
  }

   res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: 'Internal server error' });
}

  }

  //---------------------------------------

  verifyOtp = async (req: Request, res: Response):Promise<void> => {
    try {
      const body = VerifyOtpSchema.parse(req.body)

      const result = await this._authService.verifySignupOtp(
        body.email,
        body.otp,
        body.fullName,
        body.password,
        body.role
      )

      res.status(HttpStatus.CREATED).json({ message: 'OTP verified..', ...result })
    } catch (error: unknown) {

  if (error instanceof ZodError) {
     res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation Failed', details: error.issues});
     return
  }

  if (error instanceof Error) {
     res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
     return
  }

   res.status(HttpStatus.BAD_REQUEST).json({ message: 'An unknown error occurred' });
}

  }

  //---------------------------------------------
  login = async (req: Request, res: Response):Promise<void> => {
    try {
      const body = LoginSchema.parse(req.body)

      const tokens = await this._authService.login(body.email, body.password,body.role)

      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })

      res.status(HttpStatus.OK).json({
        accessToken: tokens.accessToken,
        role: tokens.role,
        userId: tokens.userId,
      })

    } catch (error: unknown) {

  if (error instanceof ZodError) {
    
     res.status(HttpStatus.BAD_REQUEST).json({ message: 'Validation Failed', details: error.issues });
     return
  }


  if (error instanceof Error) {
    if (error.message === 'Invalid credentials') {
       res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid credentials' });
       return
    }
     res.status(HttpStatus.BAD_REQUEST).json({ message: error.message });
     return
  }

   res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
}
  }

  //----------------------------------------
  refreshToken = async (req: Request, res: Response):Promise<void> => {
    const token = req.cookies.refreshToken
    if (!token) {
      res.status(HttpStatus.UNAUTHORIZED).json({ error: 'Unauthorized' })
      return
    } 

    try {
      const tokens = await this._authService.refreshToken(token)
      res.status(HttpStatus.OK).json(tokens)
    } catch  {
      res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Invalid or expired refresh token' })
    }
  }

  //------------------------------------------------

  logout = async (req: Request, res: Response):Promise<void> => {
    try {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
      })
       res.status(HttpStatus.OK).json({ message: 'Logged out succesfully' })
    } catch {
     
       res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' })
    }
  }

  //-----------------------------------------

  googleLogin = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken, role } = req.body

    const tokens = await this._authService.googleLogin(idToken, role)

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    res.status(HttpStatus.OK).json({
      accessToken: tokens.accessToken,
      role: tokens.role,
      userId: tokens.userId,
    })
  } catch (error) {
    res.status(HttpStatus.BAD_REQUEST).json({
      message: error instanceof Error ? error.message : "Google login failed",
    })
  }
}


}
 