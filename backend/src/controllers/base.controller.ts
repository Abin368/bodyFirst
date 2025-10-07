import { Response } from 'express'
import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'
import { MESSAGES } from '../enums/message.constant'

export abstract class BaseController {
  protected getUserId(req: AuthRequest): string {
    const userId = req.user?.id
    if (!userId) {
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)
    }
    return userId
  }

  protected sendSuccess<T>(res: Response, statusCode: number, message: string, data?: T): Response {
    return res.status(statusCode).json({
      message,
      ...(data !== undefined && { data }),
    })
  }

  protected parsePagination(req: AuthRequest): { page: number; limit: number } {
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    return { page, limit }
  }
}
