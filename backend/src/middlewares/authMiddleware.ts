import { verifyAccessToken } from '../utils/token'
import { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  user?: any
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' })
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token)

    req.user = decoded
    next()
  } catch  {
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}
