import { IUser } from "../models/IUser"

export interface IUserRepository {
  create(userData: Partial<IUser>): Promise<IUser>
  findByEmail(email: string): Promise<IUser | null>
  findById(id: string): Promise<IUser | null>
  
}
