import { IOwnerGym } from '../../models/owner/IOwnerGym'

export interface IGymRepository {
  findActiveGyms(): Promise<IOwnerGym[]>
}
