import { IOtpService } from '../../interfaces/otp/IOtpService'
import { redisClient } from '../../config/redis'
import { v4 as uuid } from 'uuid'
export default class OtpService implements IOtpService {
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async storeOtp(email: string, otp: string, ttl = 30): Promise<void> {
    await redisClient.set(`otp:${email}`, otp, { EX: ttl })
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const stored = await redisClient.get(`otp:${email}`)

    if (stored === otp) {
      await redisClient.del(`otp:${email}`)
      return true
    }
    return false
  }

  async deleteOtp(email: string): Promise<void> {
    await redisClient.del(`otp:${email}`)
  }

  async createResetSession(email: string, role: string, ttl = 300): Promise<string> {
    const token = uuid()
    await redisClient.set(`reset:${token}`, JSON.stringify({ email, role, verified: false }), {
      EX: ttl,
    })

    return token
  }

  async getResetSession(
    token: string
  ): Promise<{ email: string; tole: string; verified: boolean } | null> {
    const data = await redisClient.get(`reset:${token}`)
    return data ? JSON.parse(data) : null
  }

  async verifyResetSession(token: string): Promise<void> {
    const data = await this.getResetSession(token)
    if (data) {
      data.verified = true

      await redisClient.set(`reset:${token}`, JSON.stringify(data), { EX: 300 })
    }
  }

  async deleteResetSession(token: string): Promise<void> {
    await redisClient.del(`reset:${token}`)
  }
}
