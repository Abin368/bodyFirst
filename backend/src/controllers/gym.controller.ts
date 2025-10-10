import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { Response } from 'express'
import { inject, injectable } from 'inversify'
import TYPES from '../di/types'

import { HttpStatus } from '../enums/http.status'
import { MESSAGES } from '../enums/message.constant'
import { IGymController } from '../interfaces/controllers/IGymController'
import { IGymService } from '../interfaces/services/gym/IGymService'
import { GymListResponseSchema } from '../dtos/gyms/gyms.response.schema'
import { BaseController } from './base.controller'
@injectable()
export default class GymController extends BaseController implements IGymController {
  constructor(@inject(TYPES.GymService) private readonly _gymService: IGymService) {
    super()
  }

  //--------------------------------------------------
  getGyms = async (req: AuthRequest, res: Response): Promise<Response> => {
    const { search = '', page = '1', limit = '12' } = req.query as Record<string, string>

    const result = await this._gymService.getActiveGyms(search, Number(page), Number(limit))
    const response = GymListResponseSchema.parse({
      message: MESSAGES.GYM.FETCHED_SUCCESSFULLY,
      data: result.gyms,
      total: result.totalGyms,
      page: result.currentPage,
      totalPages: result.totalPages,
    })
    return res.status(HttpStatus.OK).json(response)
  }
  //-------------------------------------------------------------
}
