import { injectable } from 'inversify'
import AWS from 'aws-sdk'
import { v4 as uuidv4 } from 'uuid'
import { IS3Repository } from '../../interfaces/repository/common/IS3Repository'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { MESSAGES } from '../../enums/message.constant'

@injectable()
export default class S3Repository implements IS3Repository {
  private s3: AWS.S3
  private bucketName: string

  constructor() {
    this.bucketName = process.env.AWS_S3_BUCKET || ''
    this.s3 = new AWS.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    })
  }

  async uploadFile(
    userId: string,
    fileBuffer: Buffer,
    mimeType: string,
    prefix = 'temp'
  ): Promise<{ key: string; url: string }> {
    const uniqueId = uuidv4()
    const key = `${prefix}/${userId}/${uniqueId}.jpg`
    console.log('key is ', key)

    const params: AWS.S3.PutObjectRequest = {
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: mimeType,
    }

    try {
      await this.s3.putObject(params).promise()
    } catch (err) {
      console.error(' Error:', err)
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OWNER.FILE_UPLOAD_FAILED)
    }

    const url = `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
    return { key, url }
  }

  //---------------------------------

  async moveFile(tempKey: string, userId: string, permenetPrefix = 'gyms'): Promise<string> {
    const fileName = tempKey.split('/').pop()
    if (!fileName) throw new AppError(HttpStatus.BAD_REQUEST, MESSAGES.OWNER.INVALID_FILE_UPLOAD)

    const permanentKey = `${permenetPrefix}/${userId}/${fileName}`

    try {
      await this.s3
        .copyObject({
          Bucket: this.bucketName,
          CopySource: `${this.bucketName}/${tempKey}`,
          Key: permanentKey,
        })
        .promise()

      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: tempKey,
        })
        .promise()
    } catch (err) {
      console.error('S3 Move Error:', err)
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OWNER.FILE_MOVE_FAILED)
    }

    return `https://${this.bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${permanentKey}`
  }
  //------------------------------------

  async deleteFile(key: string): Promise<void> {
    try {
      await this.s3
        .deleteObject({
          Bucket: this.bucketName,
          Key: key,
        })
        .promise()
    } catch (err) {
      console.error('S3 Delete Error:', err)
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.OWNER.FILE_DELETE_FAILED)
    }
  }
}
