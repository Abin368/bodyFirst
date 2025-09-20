import { IOwnerProfile } from '../models/IOwnerProfile'
export interface IOwnerProfileRepository {
  create(data: Partial<IOwnerProfile>): Promise<IOwnerProfile>
  findByUserId(userId: string): Promise<IOwnerProfile | null>
}
