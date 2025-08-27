import bcrypt from 'bcryptjs'

import { IUser, Role } from '../models/User'

import OwnerProfileRepository from '../repositories/OwnerProfileRepository'
import { generateAccessToken, generateRefreshToken } from '../utils/token'
import { IAuthService } from '../interfaces/IAuthService'
import { IEmailService } from '../interfaces/IEmailService'
import { IUserRepository } from '../interfaces/IUserRepository'
import { sendOtpEmail } from '../utils/EmailService'
import { ITokenService,DecodedToken } from '../interfaces/ITokenService'
import { IOtpService } from '../interfaces/IOtpService'


export interface Tokens {
    accessToken: string;
    refreshToken: string
}


export default class AuthService implements IAuthService {

   

 constructor(
    private userRepository: IUserRepository,
    private tokenService: ITokenService,
    private otpService: IOtpService,
    private emailService: IEmailService
       
    ) {}
    //---------------------------------------

    async requestSignup(email: string, role: Role): Promise<string> {
        const existingUser = await this.userRepository.findByEmail(email)
        if (existingUser) {
            throw new Error('User already exists')
        }

        const otp = this.otpService.generateOtp()
        await this.otpService.storeOtp(email, otp)
        await this.emailService.sendOtp(email,otp)
        console.log(`OTP for ${email}: ${otp}`);
        return otp;
    }

    //------------------------------------


    async verifySignupOtp(
        email: string,
        otp: string,
        fullName: string,
        password: string,
        role: Role,
        gymId?: string 
    ): Promise<{ accessToken: string; refreshToken: string; user: IUser }> {

        const isValid = await this.otpService.verifyOtp(email, otp);
        console.log('email from authService:', email);
        console.log('isValid:', isValid);
        if (!isValid) {
            throw new Error('Invalid or expired OTP');
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        let user: IUser;

        if (role === 'owner') {
            
            user = await this.userRepository.create({
                email,
                fullName,
                passwordHash,
                role,
                isVerified: true,
                isOnboarded: false,
                profileStep: 1, 
            });
        } else {
            
            if (!gymId) throw new Error('Gym must be selected for members');

            user = await this.userRepository.create({
                email,
                fullName,
                passwordHash,
                role,
                gymId,
                isVerified: true,
                isOnboarded: true,
                profileStep: 3,
            });
        }

        const accessToken = generateAccessToken({ userId: user._id, role: user.role, gymId: user.gymId });
        const refreshToken = generateRefreshToken({ userId: user._id });

        return { accessToken, refreshToken, user };
    }


    //---------------------------------------

    async login(email: string, password: string): Promise<Tokens> {
        const user = await this.userRepository.findByEmail(email)
        if (!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(password, user.passwordHash)
        if (!isMatch) throw new Error('Invalid credentials')

        const accessToken = generateAccessToken({ userId: user._id, role: user.role, gymId: user.gymId })
        const refreshToken = generateRefreshToken({ userId: user._id })
        return { accessToken, refreshToken }
    }

    //---------------------------------

   async refreshToken(token: string): Promise<{ accessToken: string; userId: string; role: Role; gymId?: string }> {
        
        const decodedRaw = this.tokenService.verifyRefreshToken(token);

       
        const validRoles: Role[] = ['owner', 'member', 'trainer'];
        if (!validRoles.includes(decodedRaw.role as Role)) {
            throw new Error('Invalid role in token');
        }

       
        const decoded: DecodedToken = {
            userId: decodedRaw.userId,
            role: decodedRaw.role as Role,
            gymId: decodedRaw.gymId
        };

       
        const accessToken = this.tokenService.generateAccessToken(decoded);

       
        return {
            accessToken,
            userId: decoded.userId,
            role: decoded.role,
            gymId: decoded.gymId
        };
    }

}
