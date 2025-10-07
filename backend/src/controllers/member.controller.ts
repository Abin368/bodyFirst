import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { Response } from 'express'
import { inject, injectable } from 'inversify'
import TYPES from '../di/types'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'
import { MESSAGES } from '../enums/message.constant'
import { IMemberController } from '../interfaces/controllers/IMemberController'
import { IMemberService } from '../interfaces/services/member/IMemberServices'
import {
  GetProfileResponseSchema,
  MemberSchemaType,
  UploadImgResponseSchema,
  UploadMemberResponseSchema,
} from '../dtos/member/member.dtos'
import logger from '../utils/logger'
import { BaseController } from './base.controller'

@injectable()
export default class MemberController extends BaseController implements IMemberController {
  constructor(
    @inject(TYPES.MemberService)
    private readonly _memberService: IMemberService
  ) {
    super()
  }
  //---------------------------------
  getMemberProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = this.getUserId(req)
    const profile = await this._memberService.getProfileByUserId(userId)

    const response = GetProfileResponseSchema.parse({
      message: MESSAGES.MEMBER.PROFILE_FETCHED_SUCCESS,
      data: profile,
    })
    return res.status(HttpStatus.OK).json(response)
  }
  //----------------------------------------------
  uploadProfileImg = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = this.getUserId(req)
    const file = req.file
    if (!file) throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.NO_FILE)

    logger.info(`Member ${userId} uploading profile image`)

    const { url, key } = await this._memberService.uploadProfileImage(userId, file)
    const response = UploadImgResponseSchema.parse({
      message: MESSAGES.OWNER.FILE_UPLOAD_SUCCESS,
      url,
      key,
    })
    return res.status(HttpStatus.OK).json(response)
  }
  //-----------------------------------------------
  uploadProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = this.getUserId(req)
    const memberData = req.body as MemberSchemaType

    const newProfile = await this._memberService.createProfile(userId, memberData)
    console.log('new profile', newProfile)
    const response = UploadMemberResponseSchema.parse({
      message: MESSAGES.MEMBER.PROFILE_CREATED_SUCCESS,
      data: newProfile,
    })
    return res.status(HttpStatus.CREATED).json(response)
  }
}
