import { IUserRepository } from "../interfaces/user/IUserRepository"
import User from '../models/User'
import { IUser } from "../interfaces/models/IUser"

export default class UserRepository implements IUserRepository {
  async create(userData: Partial<IUser>): Promise<IUser> {
    try {
      const user = new User(userData)
      return await user.save()
    } catch (error) {
      throw new Error(`Error creating user: ${error}`)
    }
  }

  async findByEmail(email: string): Promise<IUser | null> {
    try {
      return await User.findOne({ email })
    } catch (error) {
      throw new Error(`Error finding user by email: ${error}`)
    }
  }

  async findById(id: string): Promise<IUser | null> {
    try {
      return await User.findById(id)
    } catch (error) {
      throw new Error(`Error finding user by ID: ${error}`)
    }
  }



async update(id: string, updateData: Partial<IUser>): Promise<IUser | null> {
  try {
    return await User.findByIdAndUpdate(id, updateData, { new: true }).exec()
  } catch (error) {
    throw new Error(`Error updating user: ${error}`)
  }
}


async updatePassword(email: string, hashedPassword: string): Promise<IUser | null> {
  try {
    return await User.findOneAndUpdate(
      { email },
      { $set: { passwordHash: hashedPassword } },
      { new: true }
    ).exec()
  } catch (error) {
    throw new Error(`Error updating password: ${error}`)
  }
}


}
