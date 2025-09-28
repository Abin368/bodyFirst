import { IOwnerProfile } from '../models/IOwnerProfile'
import { GymSchema } from '../../dtos/owner.dtos'
import mongoose from 'mongoose'
import { IOwnerGym } from '../models/IOwnerGym'

export interface IOwnerServices {
  getProfileByUserId(userId: string): Promise<IOwnerProfile>
  uploadGymImage(ownerId: string, file: Express.Multer.File): Promise<{ key: string; url: string }>
  createGym(
    userId: string,
    gymData: GymSchema & { tempImageKey?: string }
  ): Promise<{ gym: IOwnerGym; profile: IOwnerProfile }>
}

export interface GymCreateDTO {
  userId: mongoose.Types.ObjectId
  name: string
  contactNo: string
  website?: string | null
  address: {
    street: string
    city: string
    state: string
    pincode: string
  }
  images: string[]
  services: string[]
}
