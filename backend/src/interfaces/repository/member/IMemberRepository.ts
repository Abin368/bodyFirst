import { SaveOptions } from 'mongoose'
import { IMemberProfile } from '../../models/member/IMemberProfile'
export interface IMemberRepository {
  create(data: Partial<IMemberProfile>, options?: SaveOptions): Promise<IMemberProfile>
  findByUserId(userId: string): Promise<IMemberProfile | null>
  existsUserById(userId: string): Promise<boolean>
}
