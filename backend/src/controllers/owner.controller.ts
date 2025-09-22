import { Response } from 'express'
import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { inject, injectable } from 'inversify'
import TYPES from '../di/types'
import { IOwnerServices } from '../interfaces/services/IOwnerServices'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'
import { IOwnerController } from '../interfaces/controllers/IOwnerController'

@injectable()
export default class OwnerController implements IOwnerController {
  constructor(@inject(TYPES.OwnerService) private readonly _ownerService: IOwnerServices) {}

  getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    const userId = req.user?.id

    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized')

    const profile = await this._ownerService.getProfileByUserId(userId)

    res.status(HttpStatus.OK).json({
      message: 'Owner profile fetched successfully',
      data: profile,
    })
  }
  //----------------------------------------------------
}
