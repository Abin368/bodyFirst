import { BaseRepository } from '../common/base.repository'
import ownerGym from '../../models/owner/owner.gym'
import { injectable } from 'inversify'
import logger from '../../utils/logger'
import { HttpStatus } from '../../enums/http.status'
import { IOwnerGym } from '../../interfaces/models/owner/IOwnerGym'
import { IGymRepository } from '../../interfaces/repository/gym/IGymRepository'
import { MESSAGES } from '../../enums/message.constant'
import { AppError } from '../../errors/app.error'
@injectable()
export default class GymRepository extends BaseRepository<IOwnerGym> implements IGymRepository {
  constructor() {
    super(ownerGym)
  }

  async findActiveGyms(): Promise<IOwnerGym[]> {
    try {
      const gyms = await this.find({ status: 'ACTIVE' })
      return gyms
    } catch (err: any) {
      logger.error('[GymRepository] Failed to find active gyms', { error: err })
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.COMMON.SERVER_ERROR)
    }
  }
}
