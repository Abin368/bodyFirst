import { injectable } from 'inversify'
import { IUserRepository } from '../interfaces/user/IUserRepository'
import { IUser } from '../interfaces/models/IUser'
import User from '../models/user.model'
import { AppError } from '../errors/app.error'
import { HttpStatus } from '../enums/http.status'

@injectable()
export default class UserRepository implements IUserRepository {
  // ------------------------------
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData)
      return await user.save()
    } catch (error: any) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, `Error creating user: ${error.message}`)
    }
  }

  // ------------------------------
  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email }).exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error finding user by email: ${error.message}`
      )
    }
  }

  // ------------------------------
  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id).exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error finding user by ID: ${error.message}`
      )
    }
  }

  // ------------------------------
  async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await User.findByIdAndUpdate(id, updateData, { new: true }).exec()
    } catch (error: any) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, `Error updating user: ${error.message}`)
    }
  }

  // ------------------------------
  async updatePassword(email: string, hashedPassword: string): Promise<IUser | null> {
    try {
      return await User.findOneAndUpdate(
        { email },
        { $set: { passwordHash: hashedPassword } },
        { new: true }
      ).exec()
    } catch (error: any) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Error updating password: ${error.message}`
      )
    }
  }
}
