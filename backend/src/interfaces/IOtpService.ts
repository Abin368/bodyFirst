export interface IOtpService {
    generateOtp(): string;
    storeOtp(email: string, otp: string, ttl?: number): Promise<void>;
    verifyOtp(email: string, otp: string): Promise<boolean>;
}
