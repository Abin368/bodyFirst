import { injectable } from 'inversify'
import { IUserRepository } from '../../interfaces/repository/common/IUserRepository'
import { IUser } from '../../interfaces/models/common/IUser'
import User from '../../models/common/user.model'
import { BaseRepository } from '../common/base.repository'
import { AppError } from '../../errors/app.error'
import { HttpStatus } from '../../enums/http.status'

@injectable()
export default class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User)
  }

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
