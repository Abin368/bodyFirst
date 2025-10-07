import { IOwnerGym } from '../../models/owner/IOwnerGym'

export interface IGymService {
  getActiveGyms(): Promise<IOwnerGym[]>
}
