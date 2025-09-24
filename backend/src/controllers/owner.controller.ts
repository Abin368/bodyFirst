import { Response } from 'express'
import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { inject, injectable } from 'inversify'
import TYPES from '../di/types'
import { IOwnerServices } from '../interfaces/services/IOwnerServices'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'
import { IOwnerController } from '../interfaces/controllers/IOwnerController'
import { MESSAGES } from '../enums/message.constant'

@injectable()
export default class OwnerController implements IOwnerController {
  constructor(@inject(TYPES.OwnerService) private readonly _ownerService: IOwnerServices) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id

    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)

    const profile = await this._ownerService.getProfileByUserId(userId)

    res.status(HttpStatus.OK).json({
      message: MESSAGES.OWNER.PROFILE_FETCHED_SUCCESS,
      data: profile,
    })
  }
  //----------------------------------------------------
}
