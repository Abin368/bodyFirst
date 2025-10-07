import { inject, injectable } from 'inversify'
import TYPES from '../../di/types'
import { IS3Repository } from '../../interfaces/repository/common/IS3Repository'
import { IImageService } from '../../interfaces/services/common/IImageService'

@injectable()
export class ImageService implements IImageService {
  constructor(@inject(TYPES.S3Repository) private readonly _s3Repository: IS3Repository) {}

  async handleGymImages(
    tempImageKey?: string,
    existingImages?: string[],
    ownerId?: string
  ): Promise<string[]> {
    if (tempImageKey) {
      const movedUrl = await this._s3Repository.moveFile(tempImageKey, ownerId!)
      return [movedUrl]
    }
    return existingImages ?? []
  }
}
