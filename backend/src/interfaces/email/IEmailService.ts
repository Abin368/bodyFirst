export type OtpType = "signup" | "forget"

export interface IEmailService {
  sendOtp(email: string, otp: string, type: OtpType): Promise<void>
}
