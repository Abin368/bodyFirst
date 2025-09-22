import { Response, NextFunction, RequestHandler } from 'express'
import { AppError } from '../errors/app.error'
import { verifyAccessToken } from '../utils/token'
import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { HttpStatus } from '../enums/http.status'

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized')
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token) as { userId: string; role: string }
    ;(req as AuthRequest).user = { id: decoded.userId, role: decoded.role }
    next()
  } catch (err: any) {
    next(new AppError(HttpStatus.UNAUTHORIZED, err?.message || 'Invalid token'))
  }
}
