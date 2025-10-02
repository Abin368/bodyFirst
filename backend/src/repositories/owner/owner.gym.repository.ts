import ownerGym from '../../models/owner/owner.gym'
import { IOwnerGym } from '../../interfaces/models/IOwnerGym'
import { IOwnerGymRepository } from '../../interfaces/repository/IOwnerGymRepository'
import { BaseRepository } from '../common/base.repository'

export default class OwnerGymRepository
  extends BaseRepository<IOwnerGym>
  implements IOwnerGymRepository
{
  constructor() {
    super(ownerGym)
  }
}
