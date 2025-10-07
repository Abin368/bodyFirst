export interface IS3Repository {
  uploadFile(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string
  ): Promise<{ key: string; url: string }>
  moveFile(tempKey: string, userId: string): Promise<string>
  deleteFile(key: string): Promise<void>
}
