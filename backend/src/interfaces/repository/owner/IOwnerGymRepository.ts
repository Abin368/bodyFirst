import { IOwnerGym } from '../../models/owner/IOwnerGym'
import { SaveOptions, FilterQuery, UpdateQuery, ClientSession } from 'mongoose'

export interface IOwnerGymRepository {
  create(data: Partial<IOwnerGym>, options?: SaveOptions): Promise<IOwnerGym>
  updateMany(
    filter: FilterQuery<IOwnerGym>,
    update: UpdateQuery<Partial<IOwnerGym>>,
    session?: ClientSession
  ): Promise<{ acknowledged: boolean; modifiedCount: number }>
}
