import { IMemberRepository } from '../../interfaces/repository/member/IMemberRepository'

import { BaseRepository } from '../common/base.repository'
import { injectable } from 'inversify'

import mongoose from 'mongoose'
import { IMemberProfile } from '../../interfaces/models/member/IMemberProfile'
import memberModel from '../../models/member/member.model'
import User from '../../models/common/user.model'

@injectable()
export default class MemberRepository
  extends BaseRepository<IMemberProfile>
  implements IMemberRepository
{
  constructor() {
    super(memberModel)
  }

  async findByUserId(userId: string): Promise<IMemberProfile | null> {
    const objectId = new mongoose.Types.ObjectId(userId)
    return this.model.findOne({ userId: objectId }).lean<IMemberProfile>().exec()
  }

  async existsUserById(userId: string): Promise<boolean> {
    const user = await User.findById(userId).lean().exec()
    return !!user
  }
}
