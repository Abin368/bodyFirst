import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { IUser } from '../models/User'
import UserRepository from '../repositories/UserRepository'
import { generateAccessToken,generateRefreshToken } from '../utils/token'

export interface Tokens {
    accessToken :string;
    refreshToken :string
}


export default class AuthService {

    private userRepository :UserRepository;

    constructor(userRepository:UserRepository){
        this.userRepository =userRepository
    }

    async login(email:string , password :string): Promise<Tokens>{
        const user = await this.userRepository.findByEmail(email)
        if(!user) throw new Error('Invalid credentials');

        const isMatch = await bcrypt.compare(password,user.passwordHash)
        if(!isMatch) throw new Error('Invalid credentials')

        const accessToken =generateAccessToken({userId :user._id,role:user.role,gymId:user.gymId})
        const refreshToken= generateRefreshToken({userId:user._id})
            return {accessToken,refreshToken}
    }
}

