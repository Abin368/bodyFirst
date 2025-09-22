import { IOwnerProfile } from '../models/IOwnerProfile'

export interface IOwnerServices {
  getProfileByUserId(userId: string): Promise<IOwnerProfile>
}
