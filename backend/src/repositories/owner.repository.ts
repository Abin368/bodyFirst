import ownerProfile from '../models/owner.model'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'
import { IOwnerProfileRepository } from '../interfaces/repository/IOwnerProfileRepository'

export default class OwnerProfileRepository implements IOwnerProfileRepository {
  async create(data: Partial<IOwnerProfile>): Promise<IOwnerProfile> {
    const profile = new ownerProfile(data)
    return await profile.save()
  }

  async findByUserId(userId: string): Promise<IOwnerProfile | null> {
    return await ownerProfile.findOne({ userId }).lean<IOwnerProfile>().exec()
  }
}
