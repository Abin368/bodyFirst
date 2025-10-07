import { Response } from 'express'
import { AuthRequest } from '../user/auth-request.interface'

export interface IMemberController {
  getMemberProfile(req: AuthRequest, res: Response): Promise<Response>
  uploadProfileImg(req: AuthRequest, res: Response): Promise<Response>
  uploadProfile(req: AuthRequest, res: Response): Promise<Response>
}
