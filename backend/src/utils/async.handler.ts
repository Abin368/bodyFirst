import { Request, Response, NextFunction, RequestHandler } from 'express'

export const asyncHandler =
  <Req extends Request>(
    fn: (req: Req, res: Response, next: NextFunction) => Promise<any>
  ): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req as Req, res, next)).catch(next)
  }
