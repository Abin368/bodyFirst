import { IEmailService } from "../interfaces/email/IEmailService"
import { sendOtpEmail } from '../utils/EmailService'

export default class EmailService implements IEmailService {
  async sendOtp(email: string, otp: string): Promise<void> {
    await sendOtpEmail(email, otp)
  }
}
