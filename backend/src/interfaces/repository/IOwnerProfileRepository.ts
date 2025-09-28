import { IOwnerProfile } from '../models/IOwnerProfile'
import { SaveOptions } from 'mongoose'

export interface IOwnerProfileRepository {
  create(data: Partial<IOwnerProfile>, options?: SaveOptions): Promise<IOwnerProfile>
  findByUserId(userId: string): Promise<IOwnerProfile | null>
}
