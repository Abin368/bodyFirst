import { Response, Request } from 'express'
import { AuthRequest } from '../user/auth-request.interface'

export interface IOwnerController {
  getProfile(req: AuthRequest, res: Response): Promise<Response>
  uploadImg(req: Request, res: Response): Promise<Response>
  uploadGym(req: AuthRequest, res: Response): Promise<Response>
  paymentCheckout(req: AuthRequest, res: Response): Promise<Response>
}
