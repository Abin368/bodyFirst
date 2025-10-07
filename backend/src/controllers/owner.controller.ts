import { Response } from 'express'
import { AuthRequest } from '../interfaces/user/auth-request.interface'
import { inject, injectable } from 'inversify'
import TYPES from '../di/types'
import { IOwnerServices } from '../interfaces/services/owner/IOwnerServices'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'
import { IOwnerController } from '../interfaces/controllers/IOwnerController'
import { MESSAGES } from '../enums/message.constant'
import {
  GetProfileResponseSchema,
  UploadImgResponseSchema,
  UploadGymResponseSchema,
  CheckoutPaymentResponseSchema,
} from '../dtos/owner/owner.response.dto'
import { GymSchema, CheckoutPaymentSchema } from '../dtos/auth/owner.dtos'

@injectable()
export default class OwnerController implements IOwnerController {
  constructor(@inject(TYPES.OwnerService) private readonly _ownerService: IOwnerServices) {}

  private getUserId(req: AuthRequest): string {
    const userId = req.user?.id
    if (!userId) throw new AppError(HttpStatus.UNAUTHORIZED, MESSAGES.AUTH.UNAUTHORIZED)
    return userId
  }
  //--------------------------------------------
  getProfile = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = this.getUserId(req)

    const profile = await this._ownerService.getProfileByUserId(userId)

    const response = GetProfileResponseSchema.parse({
      message: MESSAGES.OWNER.PROFILE_FETCHED_SUCCESS,
      data: profile,
    })

    return res.status(HttpStatus.OK).json(response)
  }
  //----------------------------------------------------

  uploadImg = async (req: AuthRequest, res: Response): Promise<Response> => {
    const ownerId = this.getUserId(req)

    const file = req.file
    if (!file) throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.NO_FILE)

    const { key, url } = await this._ownerService.uploadGymImage(ownerId, file)

    const response = UploadImgResponseSchema.parse({
      message: MESSAGES.OWNER.FILE_UPLOAD_SUCCESS,
      key,
      url,
    })

    return res.status(HttpStatus.OK).json(response)
  }

  //-----------------------------------------
  uploadGym = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = this.getUserId(req)
    const gymData = GymSchema.parse(req.body)
    const newGym = await this._ownerService.createGym(userId, gymData)
    const response = UploadGymResponseSchema.parse({
      message: MESSAGES.OWNER.GYM_CREATED_SUCCESS,
      data: newGym,
    })

    return res.status(HttpStatus.OK).json(response)
  }
  //--------------------------------------------

  paymentCheckout = async (req: AuthRequest, res: Response): Promise<Response> => {
    const userId = this.getUserId(req)

    const { priceId } = CheckoutPaymentSchema.parse(req.body)

    const checkoutUrl = await this._ownerService.checkoutPayment(userId, priceId)

    const response = CheckoutPaymentResponseSchema.parse({
      message: MESSAGES.OWNER.CHECKOUT_SUCCESS,
      data: { checkoutUrl },
    })

    return res.status(HttpStatus.OK).json(response)
  }
}
