import ownerProfile from '../../models/owner/owner.model'
import { IOwnerProfile } from '../../interfaces/models/owner/IOwnerProfile'
import { IOwnerProfileRepository } from '../../interfaces/repository/owner/IOwnerProfileRepository'
import { BaseRepository } from '../common/base.repository'
import { injectable } from 'inversify'
import { ClientSession, FilterQuery, UpdateQuery } from 'mongoose'

@injectable()
export default class OwnerProfileRepository
  extends BaseRepository<IOwnerProfile>
  implements IOwnerProfileRepository
{
  constructor() {
    super(ownerProfile)
  }

  async findByUserId(userId: string): Promise<IOwnerProfile | null> {
    return this.model.findOne({ userId }).lean<IOwnerProfile>().exec()
  }

  async updateByUserId(
    userId: string,
    updateData: Partial<IOwnerProfile>,
    session?: ClientSession
  ): Promise<IOwnerProfile | null> {
    return this.model.findOneAndUpdate({ userId }, updateData, { new: true, session }).exec()
  }

  async findMany(
    filter: FilterQuery<IOwnerProfile>,
    session?: ClientSession
  ): Promise<IOwnerProfile[]> {
    const query = this.model.find(filter)
    if (session) query.session(session)
    return query.lean<IOwnerProfile[]>().exec()
  }

  async updateMany(
    filter: FilterQuery<IOwnerProfile>,
    update: UpdateQuery<Partial<IOwnerProfile>>,
    session?: ClientSession
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    const result = await this.model.updateMany(filter, update, { session })
    return {
      acknowledged: result.acknowledged,
      modifiedCount: result.modifiedCount,
    }
  }
}
