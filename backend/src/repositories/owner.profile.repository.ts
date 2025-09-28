import ownerProfile from '../models/owner.model'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'
import { IOwnerProfileRepository } from '../interfaces/repository/IOwnerProfileRepository'
import { BaseRepository } from './base.repository'

export default class OwnerProfileRepository
  extends BaseRepository<IOwnerProfile>
  implements IOwnerProfileRepository
{
  constructor() {
    super(ownerProfile)
  }

  async findByUserId(userId: string): Promise<IOwnerProfile | null> {
    return await ownerProfile.findOne({ userId }).lean<IOwnerProfile>().exec()
  }
}
