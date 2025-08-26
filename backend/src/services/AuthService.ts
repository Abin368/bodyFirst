import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUser, Role } from '../models/User'
import UserRepository from '../repositories/UserRepository'
import OwnerProfileRepository from '../repositories/OwnerProfileRepository'
import { generateAccessToken, generateRefreshToken } from '../utils/token'
import { v4 as uuidv4 } from 'uuid'
import { generateOtp, storeOtp, verifyOtp } from '../utils/otp'
import crypto from 'crypto'

export interface Tokens {
    accessToken: string;
    refreshToken: string
}


export default class AuthService {

    private userRepository: UserRepository;
    private ownerRepository: OwnerProfileRepository;

    constructor(userRepository: UserRepository,
        ownerRepository: OwnerProfileRepository
    ) {
        this.userRepository = userRepository,
            this.ownerRepository = ownerRepository
    }
    //---------------------------------------

    async requestSignup(email: string, role: Role): Promise<string> {
        const existingUser = await this.userRepository.findByEmail(email)
        if (existingUser) {
            throw new Error('User already exists')
        }

        const otp = generateOtp()
        await storeOtp(email, otp)

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

        const isValid = await verifyOtp(email, otp);
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



}

