import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'

export const errorHandler = (err: unknown, req: Request, res: Response,next:NextFunction) => {
 
  if (err instanceof ZodError) {
    return res.status(HttpStatus.BAD_REQUEST).json({
      success: false,
      message: 'Validation Failed',
      errors: err.issues,
    })
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.details ?? null,
    })
  }

  if (err instanceof Error) {
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: err.message || 'Internal Server Error',
    })
  }

  return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal Server Error',
  })
}
