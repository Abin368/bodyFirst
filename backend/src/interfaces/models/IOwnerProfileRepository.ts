import { IOwnerProfile } from './IOwnerProfile'
export interface IOwnerProfileRepository {
  create(data: Partial<IOwnerProfile>): Promise<IOwnerProfile>
}
