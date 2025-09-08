import { IOtpService } from "../interfaces/otp/IOtpService"
import { redisClient } from '../config/redis'

export default class OtpService implements IOtpService {
  generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  async storeOtp(email: string, otp: string, ttl = 30): Promise<void> {
    await redisClient.set(`otp:${email}`, otp, { EX: ttl })
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const stored = await redisClient.get(`otp:${email}`)
    console.log('Email from OtpService:', email)
    console.log('Stored OTP:', stored)

    if (stored === otp) {
      await redisClient.del(`otp:${email}`)
      return true
    }
    return false
  }

  async deleteOtp(email: string, otp: string): Promise<void> {
    await redisClient.del(`otp:${email}`)
  }
}
