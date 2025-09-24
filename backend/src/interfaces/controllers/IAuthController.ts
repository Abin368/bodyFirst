import { Request, Response } from 'express'

export interface IAuthController {
  requestOtp(req: Request, res: Response): Promise<Response>
  verifyOtp(req: Request, res: Response): Promise<Response>
  login(req: Request, res: Response): Promise<Response>
  refreshToken(req: Request, res: Response): Promise<Response>
  logout(req: Request, res: Response): Promise<Response>
  googleLogin(req: Request, res: Response): Promise<Response>
  forgetOtp(req: Request, res: Response): Promise<void>
  verifyForgetOtp(req: Request, res: Response): Promise<Response>
  resetPassword(req: Request, res: Response): Promise<Response>
}
