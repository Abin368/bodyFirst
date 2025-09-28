import { IOwnerGym } from '../models/IOwnerGym'
import { SaveOptions } from 'mongoose'

export interface IOwnerGymRepository {
  create(data: Partial<IOwnerGym>, options?: SaveOptions): Promise<IOwnerGym>
}
