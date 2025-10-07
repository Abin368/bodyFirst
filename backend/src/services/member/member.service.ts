import { inject, injectable } from 'inversify'
import TYPES from '../../di/types'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { MESSAGES } from '../../enums/message.constant'
import { MemberSchemaType } from '../../dtos/member/member.dtos'
import mongoose from 'mongoose'
import logger from '../../utils/logger'
import { IMemberRepository } from '../../interfaces/repository/member/IMemberRepository'
import { IMemberService } from '../../interfaces/services/member/IMemberServices'
import { IMemberProfile } from '../../interfaces/models/member/IMemberProfile'
import { IImageService } from '../../interfaces/services/common/IImageService'
import { IS3Repository } from '../../interfaces/repository/common/IS3Repository'

@injectable()
export default class MemberService implements IMemberService {
  constructor(
    @inject(TYPES.MemberRepository) private readonly _memberRepository: IMemberRepository,
    @inject(TYPES.S3Repository) private readonly _s3Repository: IS3Repository,
    @inject(TYPES.ImageService) private readonly _imageService: IImageService
  ) {}

  async getProfileByUserId(userId: string): Promise<IMemberProfile> {
    const profile = await this._memberRepository.findByUserId(userId)
    if (!profile) {
      logger.warn(`Profile not found for user ID: ${userId}`)
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)
    }
    return profile
  }
  //-------------------------------------------------------
  async uploadProfileImage(
    userId: string,
    file: Express.Multer.File
  ): Promise<{ key: string; url: string }> {
    const member = await this._memberRepository.existsUserById(userId)
    if (!member) throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.USER.NOT_FOUND)

    const { key, url } = await this._s3Repository.uploadFile(userId, file.buffer, file.mimetype)
    return { key, url }
  }
  //-----------------------------------------------------------
  async createProfile(
    userId: string,
    profileData: MemberSchemaType & { tempImageKey?: string }
  ): Promise<IMemberProfile> {
    const memberObjectId = new mongoose.Types.ObjectId(userId)

    const existingProfile = await this._memberRepository.findByUserId(userId)
    if (existingProfile) {
      throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.MEMBER.PROFILE_ALREADY_EXISTS)
    }

    const finalImages = await this._imageService.handleGymImages(
      profileData.tempImageKey,
      profileData.images,
      userId
    )

    if (!finalImages) {
      throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.COMMON.FAILED)
      logger.error(`error occured to get finalimage!!`)
    }

    try {
      const profile = await this.createProfileEntity(memberObjectId, profileData, finalImages)
      if (!profile) {
        throw new AppError(HttpStatus.NOT_FOUND, MESSAGES.COMMON.FAILED)
        logger.error('error to create profile')
      }
      return profile
    } catch (error) {
      logger.error(`Failed to create profile for user ${userId}`, error)
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.MEMBER.PROFILE_CREATION_FAILED)
    }
  }
  //--------------------------------------------------------------------
  private async createProfileEntity(
    userId: mongoose.Types.ObjectId,
    profileData: MemberSchemaType,
    images: string[]
  ) {
    return this._memberRepository.create({ userId, ...profileData, images })
  }
}
