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

  async getActiveGyms(): Promise<IOwnerGym[]> {
    try {
      const gyms = await this._gymRepository.findActiveGyms()
      logger.info(`[GymService] Fetched active gyms`)
      return gyms
    } catch (err) {
      logger.error('[GymService] Failed to fetch active gyms', { error: err })
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.COMMON.SERVER_ERROR)
    }
  }
}
