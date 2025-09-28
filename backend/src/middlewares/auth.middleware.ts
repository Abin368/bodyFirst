import { RequestHandler } from 'express'
import { AppError } from '../errors/app.error'
import { verifyAccessToken } from '../utils/token'
import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { HttpStatus } from '../enums/http.status'
import { MESSAGES } from '../enums/message.constant'

export const authMiddleware: RequestHandler = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyAccessToken(token) as { userId: string; role: string }
    ;(req as AuthRequest).user = { id: decoded.userId, role: decoded.role }
    next()
  } catch (err: unknown) {
    if (err instanceof AppError) {
      next(err)
    } else if (err instanceof Error) {
      next(new AppError(HttpStatus.UNAUTHORIZED, err.message))
    } else {
      next(new AppError(HttpStatus.UNAUTHORIZED, 'Invalid token'))
    }
  }
}
