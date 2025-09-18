export class AppError extends Error {
  public readonly statusCode: number
  public readonly details?: any
  public readonly isOperational: boolean

  constructor(statusCode: number, message: string, details?: any, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.details = details
    this.isOperational = isOperational

    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this)
  }
}
