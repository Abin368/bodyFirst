export interface IOtpService {
  generateOtp(): string
  storeOtp(email: string, otp: string, ttl?: number): Promise<void>
  verifyOtp(email: string, otp: string): Promise<boolean>
  deleteOtp(email: string, otp: string): Promise<void>
  createResetSession(email:string, role:string, ttl?:number):Promise<string>
  getResetSession(token:string):Promise<{email:string;tole:string;verified:boolean}| null>
  verifyResetSession(token:string):Promise<void>
  deleteResetSession(token:string):Promise<void>
}
