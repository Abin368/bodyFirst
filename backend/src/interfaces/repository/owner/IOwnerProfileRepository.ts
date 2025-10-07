import { IOwnerProfile } from '../../models/owner/IOwnerProfile'
import { SaveOptions } from 'mongoose'
import { ClientSession, FilterQuery } from 'mongoose'

export interface IOwnerProfileRepository {
  create(data: Partial<IOwnerProfile>, options?: SaveOptions): Promise<IOwnerProfile>
  findByUserId(userId: string): Promise<IOwnerProfile | null>
  updateByUserId(
    userId: string,
    updateData: Partial<IOwnerProfile>,
    session?: ClientSession
  ): Promise<IOwnerProfile | null>
  updateByUserId(
    userId: string,
    updateData: Partial<IOwnerProfile>,
    session?: ClientSession
  ): Promise<IOwnerProfile | null>
  findMany(filter: FilterQuery<IOwnerProfile>, session?: ClientSession): Promise<IOwnerProfile[]>
}
