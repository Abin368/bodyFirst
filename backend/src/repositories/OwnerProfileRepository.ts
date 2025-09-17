import ownerProfile from '../models/ownerProfile'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'
import { IOwnerProfileRepository } from '../interfaces/models/IOwnerProfileRepository'

export default class OwnerProfileRepository implements IOwnerProfileRepository {
  async create(data: Partial<IOwnerProfile>): Promise<IOwnerProfile> {
    const profile = new ownerProfile(data)
    return await profile.save()
  }
}
