import { Response } from 'express'
import { AuthRequest } from '../user/auth-request.interface'

export interface IGymController {
  getGyms(req: AuthRequest, res: Response): Promise<Response>
}
