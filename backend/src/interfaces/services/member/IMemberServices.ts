import { MemberSchemaType } from '../../../dtos/member/member.dtos'
import { IMemberProfile } from '../../models/member/IMemberProfile'

export interface IMemberService {
  getProfileByUserId(userId: string): Promise<IMemberProfile>
  uploadProfileImage(
    userId: string,
    file: Express.Multer.File
  ): Promise<{ key: string; url: string }>

  createProfile(
    userId: string,
    data: MemberSchemaType & { tempImageKey?: string }
  ): Promise<IMemberProfile>
}
