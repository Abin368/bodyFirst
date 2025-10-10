import { inject, injectable } from 'inversify'
import TYPES from '../../di/types'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { MESSAGES } from '../../enums/message.constant'
import { IOwnerGym } from '../../interfaces/models/owner/IOwnerGym'
import logger from '../../utils/logger'
import { IGymService } from '../../interfaces/services/gym/IGymService'
import { IGymRepository } from '../../interfaces/repository/gym/IGymRepository'

@injectable()
export default class GymService implements IGymService {
  constructor(@inject(TYPES.GymRepository) private readonly _gymRepository: IGymRepository) {}

  async getActiveGyms(
    searchTerm = '',
    page = 1,
    limit = 12
  ): Promise<{
    gyms: IOwnerGym[]
    totalGyms: number
    totalPages: number
    currentPage: number
  }> {
    try {
      const result = await this._gymRepository.findActiveGymsWithSearch(searchTerm, page, limit)
      logger.info(`[GymService] Fetched gyms (page: ${page}, search: ${searchTerm})`)
      return result
    } catch (err) {
      logger.error('[GymService] Failed to fetch active gyms', { error: err })
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.COMMON.SERVER_ERROR)
    }
  }
}
