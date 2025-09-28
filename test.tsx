
import { inject, injectable } from 'inversify'
import { IOwnerServices, GymCreateDTO } from '../interfaces/services/IOwnerServices'
import { IOwnerProfileRepository } from '../interfaces/repository/IOwnerProfileRepository'
import TYPES from '../di/types'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'
import { MESSAGES } from '../enums/message.constant'
import { IUserRepository } from '../interfaces/repository/IUserRepository'
import { IS3Repository } from '../interfaces/repository/IS3Repository'
import { GymSchema } from '../dtos/owner.dtos'
import mongoose from 'mongoose'
import { IOwnerGymRepository } from '../interfaces/repository/IOwnerGymRepository'
import { IOwnerGym } from '../interfaces/models/IOwnerGym'
import { IImageService } from '../interfaces/services/IImageService'

@injectable()
export default class OwnerService implements IOwnerServices {
  constructor(
    @inject(TYPES.OwnerProfileRepository) private readonly _ownerProfileRepository: IOwnerProfileRepository,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.S3Repository) private readonly _s3Repository: IS3Repository,
    @inject(TYPES.OwnerGymRepository) private readonly _ownerGymRepository: IOwnerGymRepository,
    @inject(TYPES.ImageService) private readonly _imageService: IImageService,
  ) { }


  private async createGymEntity(ownerId: mongoose.Types.ObjectId, gymData: GymSchema, images: string[], session: mongoose.ClientSession) {
    return await this._ownerGymRepository.create({ ownerId, ...gymData, images }, { session })
  }

  private async ensureProfileExists(userId: string, gymId: mongoose.Types.ObjectId, gymData: GymSchema, session: mongoose.ClientSession) {
    let profile = await this._ownerProfileRepository.findByUserId(userId)
    if (!profile) {
      profile = await this._ownerProfileRepository.create(
        { userId: new mongoose.Types.ObjectId(userId), gymId, contactNo: gymData.contactNo, website: gymData.website },
        { session }
      )
    }
    return profile
  }
  //--------------------------------------
  async getProfileByUserId(userId: string): Promise<IOwnerProfile> {
    const profile = await this._ownerProfileRepository.findByUserId(userId)
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    }
    return profile 
  }
  //---------------------------------------

  async uploadGymImage(ownerId: string, file: Express.Multer.File): Promise<{ key: string; url: string }> {
    const owner = await this._userRepository.findById(ownerId)
    if (!owner) throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    if (owner.role !== 'owner') throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)

    const {key,url} = await this._s3Repository.uploadFile(ownerId, file.buffer, file.mimetype)
    return {key,url}
  }

  //------------------------------------------

  async createGym(userId:string,gymData:GymSchema & { tempImageKey?: string }):Promise<{gym:IOwnerGym,profile:IOwnerProfile}>{
   
    const ownerObjectId  = new mongoose.Types.ObjectId(userId);
  
    const finalImages = await this._imageService.handleGymImages(
      gymData.tempImageKey,
      gymData.images,
      userId
    )

    const session= await mongoose.startSession()
   
    try {
     
      session.startTransaction();
      // const gym = await this._ownerGymRepository.create(
      //   {
      //     ownerId: mongoUserId,
      //     name: gymData.name,
      //     address: gymData.address,
      //     contactNo: gymData.contactNo,
      //     website: gymData.website,
      //     images: finalImages
      //   },
      //   { session }
      // )
      
    
      // let profile = await this._ownerProfileRepository.findByUserId(userId)
    
    
      // if (!profile) {
        
      //   profile = await this._ownerProfileRepository.create(
      //     {
      //       userId: mongoUserId,
      //       gymId: gym._id,
      //       contactNo: gymData.contactNo,
      //       website: gymData.website
      //     },
      //     { session }
      //   )
       
      // } 

      const gym = await this.createGymEntity(ownerObjectId, gymData, finalImages, session)
      const profile = await this.ensureProfileExists(userId, gym._id, gymData, session)

      
      await session.commitTransaction()
    
      return { gym, profile }
    } catch (error) {
      await session.abortTransaction()
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        MESSAGES.OWNER.GYM_CREATION_FAILED
      )
    }finally{
      session.endSession()
    }
  }    




}
