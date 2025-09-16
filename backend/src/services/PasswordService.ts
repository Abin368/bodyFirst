import { injectable } from 'inversify'
import bcrypt from 'bcryptjs'
import { IPasswordService } from '../interfaces/services/IPasswordService'

@injectable()
export default class PasswordService implements IPasswordService {
  async hash(password: string, saltRounds = 10): Promise<string> {
    return bcrypt.hash(password, saltRounds)
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash)
  }
}
