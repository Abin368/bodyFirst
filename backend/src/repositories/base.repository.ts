import { Model, Document, SaveOptions } from 'mongoose'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  //-----------------------------------------------
  async create(data: Partial<T>, options?: SaveOptions): Promise<T> {
    try {
      const doc = new this.model(data)
      return await doc.save(options)
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error creating document: ${error.message}`
      )
    }
  }

  //------------------------------------
  async findById(id: string): Promise<T | null> {
    try {
      return await this.model.findById(id).exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error finding document: ${error.message}`
      )
    }
  }
  //----------------------------------------
  async update(id: string, updateData: Partial<T>): Promise<T | null> {
    try {
      return await this.model.findByIdAndUpdate(id, updateData, { new: true }).exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error updating document: ${error.message}`
      )
    }
  }
  //------------------------------------------
  async delete(id: string): Promise<boolean> {
    try {
      const result = await this.model.findByIdAndDelete(id).exec()
      return !!result
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error deleting document: ${error.message}`
      )
    }
  }
  //--------------------------------------------------------
}
