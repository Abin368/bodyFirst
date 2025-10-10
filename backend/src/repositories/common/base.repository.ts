import { Model, Document, SaveOptions, FilterQuery, UpdateQuery, ClientSession } from 'mongoose'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'
import { MESSAGES } from '../../enums/message.constant'

export interface PaginationOptions {
  page?: number
  limit?: number
}

export abstract class BaseRepository<T extends Document> {
  constructor(protected model: Model<T>) {}

  //-----------------------------------------------
  async create(data: Partial<T>, options?: SaveOptions): Promise<T> {
    try {
      const doc = new this.model(data)
      const saved = await doc.save(options)
      return saved.toObject() as T
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error creating document: ${error.message}`
      )
    }
  }
  //-----------------------------------------------
  async find(filter: FilterQuery<T> = {}, session?: ClientSession): Promise<T[]> {
    try {
      const query = this.model.find(filter)
      if (session) query.session(session)
      return await query.lean<T[]>().exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error finding documents: ${error.message}`
      )
    }
  }

  //-----------------------------------------------
  async findOne(filter: FilterQuery<T>, session?: ClientSession): Promise<T | null> {
    try {
      const query = this.model.findOne(filter)
      if (session) query.session(session)
      return await query.lean<T>().exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error finding document: ${error.message}`
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

  //-----------------------------------------
  async updateMany(
    filter: FilterQuery<T>,
    update: UpdateQuery<Partial<T>>,
    session?: ClientSession
  ): Promise<{ acknowledged: boolean; modifiedCount: number }> {
    try {
      const result = await this.model.updateMany(filter, update, { session })
      return { acknowledged: result.acknowledged, modifiedCount: result.modifiedCount }
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error updating multiple documents: ${error.message}`
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
  async findByFilter(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter)
  }

  async searchWithPagination(
    baseFilter: FilterQuery<T>,
    searchTerm: string,
    page: number = 1,
    limit: number = 12,
    searchableFields: string[] = []
  ): Promise<{ data: T[]; total: number; totalPages: number; currentPage: number }> {
    try {
      const skip = (page - 1) * limit
      const searchFilter =
        searchTerm && searchableFields.length > 0
          ? {
              $or: searchableFields.map((field) => ({
                [field]: { $regex: searchTerm, $options: 'i' },
              })),
            }
          : {}

      const query = { ...baseFilter, ...searchFilter }

      const [data, total] = await Promise.all([
        this.model.find(query).skip(skip).limit(limit),
        this.model.countDocuments(query),
      ])

      const totalPages = Math.ceil(total / limit) || 1
      return { data, total, totalPages, currentPage: page }
    } catch {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, MESSAGES.COMMON.FAILED)
    }
  }
}
