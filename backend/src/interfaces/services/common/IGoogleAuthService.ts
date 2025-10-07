import { IUser } from '../../models/common/IUser'

export interface IGoogleAuthService {
  getAuthUrl(): string
  getUserInfo(code: string): Promise<Partial<IUser>>
}
