import ownerProfile from '../../models/owner/owner.model'
import { IOwnerProfile } from '../../interfaces/models/IOwnerProfile'
import { IOwnerProfileRepository } from '../../interfaces/repository/IOwnerProfileRepository'
import { BaseRepository } from '../common/base.repository'
import { injectable } from 'inversify'
import { ClientSession } from 'mongoose'

@injectable()
export default class OwnerProfileRepository
  extends BaseRepository<IOwnerProfile>
  implements IOwnerProfileRepository
{
  constructor() {
    super(ownerProfile)
  }

  async findByUserId(userId: string): Promise<IOwnerProfile | null> {
    // return await ownerProfile.findOne({ userId }).lean<IOwnerProfile>().exec()
    return this.model.findOne({userId}).lean<IOwnerProfile>().exec()
  }

  async updateByUserId(
    userId: string,
    updateData: Partial<IOwnerProfile>,
    session?: ClientSession
  ): Promise<IOwnerProfile | null> {
    return this.model
      .findOneAndUpdate({ userId }, updateData, { new: true, session })
      .exec()
  }
  
  
}
