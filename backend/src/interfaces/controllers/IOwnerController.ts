import { Response, Request } from 'express'
import { AuthRequest } from '../user/auth-request.interface'

export interface IOwnerController {
  getProfile(req: AuthRequest, res: Response): Promise<void>
  uploadImg(req: Request, res: Response): Promise<void>
  uploadGym(req: AuthRequest, res: Response): Promise<void>
}
