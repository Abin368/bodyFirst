import { Response } from 'express'
import { AuthRequest } from '../user/auth-request.interface'

export interface IOwnerController {
  getProfile(req: AuthRequest, res: Response): Promise<void>
}
