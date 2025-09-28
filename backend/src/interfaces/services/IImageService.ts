export interface IImageService {
  handleGymImages(
    tempImageKey?: string,
    existingImages?: string[],
    ownerId?: string
  ): Promise<string[]>
}
