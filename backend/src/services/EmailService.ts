import { IEmailService } from "../interfaces/email/IEmailService"
import { sendOtpEmail } from '../utils/EmailService'
export type OtpType = "signup" | "forget"
export default class EmailService implements IEmailService {
  async sendOtp(email: string, otp: string,type:OtpType): Promise<void> {
    await sendOtpEmail(email, otp,type)
  }
}
