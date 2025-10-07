import { IUser } from '../../models/common/IUser'

export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>
  findByEmail(email: string): Promise<IUser | null>
  findById(id: string): Promise<IUser | null>
  updatePassword(email: string, hashedPassword: string): Promise<IUser | null>
}
