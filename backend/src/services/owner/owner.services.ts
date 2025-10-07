import { inject, injectable } from 'inversify'
import { IOwnerServices } from '../../interfaces/services/owner/IOwnerServices'
import { IOwnerProfileRepository } from '../../interfaces/repository/owner/IOwnerProfileRepository'
import TYPES from '../../di/types'
import { IOwnerProfile } from '../../interfaces/models/owner/IOwnerProfile'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { MESSAGES } from '../../enums/message.constant'
import { IUserRepository } from '../../interfaces/repository/common/IUserRepository'
import { IS3Repository } from '../../interfaces/repository/common/IS3Repository'
import { GymSchema } from '../../dtos/auth/owner.dtos'
import mongoose from 'mongoose'
import { IOwnerGymRepository } from '../../interfaces/repository/owner/IOwnerGymRepository'
import { IOwnerGym } from '../../interfaces/models/owner/IOwnerGym'
import { IImageService } from '../../interfaces/services/common/IImageService'
import { IStripeService } from '../../interfaces/services/stripe/IStripeServices'
import logger from '../../utils/logger'

@injectable()
export default class OwnerService implements IOwnerServices {
  constructor(
    @inject(TYPES.OwnerProfileRepository)
    private readonly _ownerProfileRepository: IOwnerProfileRepository,
    @inject(TYPES.UserRepository) private readonly _userRepository: IUserRepository,
    @inject(TYPES.S3Repository) private readonly _s3Repository: IS3Repository,
    @inject(TYPES.OwnerGymRepository) private readonly _ownerGymRepository: IOwnerGymRepository,
    @inject(TYPES.ImageService) private readonly _imageService: IImageService,
    @inject(TYPES.StripeServices) private readonly _stripeServices: IStripeService
  ) {}

  private async createGymEntity(
    ownerId: mongoose.Types.ObjectId,
    gymData: GymSchema,
    images: string[],
    session: mongoose.ClientSession
  ) {
    return await this._ownerGymRepository.create({ ownerId, ...gymData, images }, { session })
  }
  //----------------------------------------------------------------------------
  private async ensureProfileExists(
    userId: string,
    gymId: mongoose.Types.ObjectId,
    gymData: GymSchema,
    session: mongoose.ClientSession
  ) {
    logger.info(`Ensuring profile exists for user ID: ${userId}`)
    let profile = await this._ownerProfileRepository.findByUserId(userId)
    if (!profile) {
      profile = await this._ownerProfileRepository.create(
        {
          userId: new mongoose.Types.ObjectId(userId),
          gymId,
          contactNo: gymData.contactNo,
          website: gymData.website,
        },
        { session }
      )
    }
    return profile
  }
  //--------------------------------------
  async getProfileByUserId(userId: string): Promise<IOwnerProfile> {
    const profile = await this._ownerProfileRepository.findByUserId(userId)
    if (!profile) {
      logger.warn(`Profile not found for user ID: ${userId}`)
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    }
    return profile
  }
  //---------------------------------------

  async uploadGymImage(
    ownerId: string,
    file: Express.Multer.File
  ): Promise<{ key: string; url: string }> {
    const owner = await this._userRepository.findById(ownerId)
    if (!owner) throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    if (owner.role !== 'owner')
      throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)

    const { key, url } = await this._s3Repository.uploadFile(ownerId, file.buffer, file.mimetype)
    return { key, url }
  }

  //------------------------------------------

  async createGym(
    userId: string,
    gymData: GymSchema & { tempImageKey?: string }
  ): Promise<{ gym: IOwnerGym; profile: IOwnerProfile }> {
    const ownerObjectId = new mongoose.Types.ObjectId(userId)

    const finalImages = await this._imageService.handleGymImages(
      gymData.tempImageKey,
      gymData.images,
      userId
    )

    const session = await mongoose.startSession()

    try {
      session.startTransaction()
      const gym = await this.createGymEntity(ownerObjectId, gymData, finalImages, session)
      const profile = await this.ensureProfileExists(userId, gym._id, gymData, session)
      await session.commitTransaction()

      return { gym, profile }
    } catch (error) {
      logger.error('error creating', error)
      await session.abortTransaction()
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OWNER.GYM_CREATION_FAILED)
    } finally {
      session.endSession()
    }
  }

  //---------------------------------------------
  async checkoutPayment(userId: string, priceId: string): Promise<string> {
    const profile = await this._ownerProfileRepository.findByUserId(userId)
    if (!profile) throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)

    const checkoutUrl = await this._stripeServices.createCheckoutSession(priceId, userId)
    if (!checkoutUrl) throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.CHECKOUT_FAILED)

    return checkoutUrl
  }
}
