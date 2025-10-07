import ownerGym from '../../models/owner/owner.gym'
import { IOwnerGym } from '../../interfaces/models/owner/IOwnerGym'
import { IOwnerGymRepository } from '../../interfaces/repository/owner/IOwnerGymRepository'
import { BaseRepository } from '../common/base.repository'
import { ClientSession, FilterQuery, UpdateQuery } from 'mongoose'

export default class OwnerGymRepository
  extends BaseRepository<IOwnerGym>
  implements IOwnerGymRepository
{
  constructor() {
    super(ownerGym)
  }

  async updateMany(
    filter: FilterQuery<IOwnerGym>,
    update: UpdateQuery<Partial<IOwnerGym>>,
    session?: ClientSession
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const result = await this.model.updateMany(filter, update, { session })
    return {
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
    }
  }
}
