// src/services/owner.service.ts
import { inject, injectable } from 'inversify'
import { IOwnerServices } from '../interfaces/services/IOwnerServices'
import { IOwnerProfileRepository } from '../interfaces/repository/IOwnerProfileRepository'
import TYPES from '../di/types'
import { IOwnerProfile } from '../interfaces/models/IOwnerProfile'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'

@injectable()
export default class OwnerService implements IOwnerServices {
  constructor(
    @inject(TYPES.OwnerProfileRepository)
    private readonly _ownerProfileRepository: IOwnerProfileRepository
  ) {}

  async getProfileByUserId(userId: string): Promise<IOwnerProfile> {
    const profile = await this._ownerProfileRepository.findByUserId(userId)
    if (!profile) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Owner profile not found')
    }
    return profile
  }
}
