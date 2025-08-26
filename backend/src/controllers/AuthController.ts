import { Request, Response } from "express";
import AuthService from "../services/AuthService";
import { generateAccessToken, verifyRefreshToken } from "../utils/token";
import { decode } from "punycode";


export default class AuthController {
    private authService: AuthService;
    constructor(authService: AuthService) {
        this.authService = authService
    }
    //--------------------------------

    requestOtp = async (req: Request, res: Response) => {
        try {
            const { email, role } = req.body;
            
            const otp = await this.authService.requestSignup(email, role)
            res.status(200).json({ message: 'OTP sent successfully' })
            
        } catch (error: any) {
            if (error.message === 'User already exists') {
                return res.status(400).json({ message: "User already exists" });
            }
            res.status(500).json({ error: "Internal server error" });
        }
    }

    //---------------------------------------

    verifyOtp = async (req: Request, res: Response) => {
        try {
            const {email,otp,fullName,password,role} = req.body
            console.log('email from authcontroller',email)

            const result = await this.authService.verifySignupOtp(email, otp,fullName,password,role)
           

           
            res.status(201).json({ message: "OTP verified.." ,...result});

        } catch (err: any) {
            res.status(400).json({ message: err.message });
        }
    }


    //---------------------------------------------
    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body

            const tokens = await this.authService.login(email, password);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict'
            })

            res.status(200).json({ accessToken: tokens.accessToken })
        } catch (error: any) {
            if (error.message === "Invalid credentials") {
                return res.status(401).json({ error: "Invalid credentials" });
            }
            res.status(500).json({ error: "Internal server error" });
        }
    }

    //----------------------------------------
    refreshToken = async (req: Request, res: Response) => {
        const token = req.cookies.refreshToken

        if (!token) return res.status(401).json({ error: 'Unauthorized' })

        try {
            const decoded: any = verifyRefreshToken(token)
            const newAccessToken = generateAccessToken({
                userId: decoded.userId,
                role: decoded.role,
                gymId: decoded.gymId

            })

            res.status(200).json({ accessToken: newAccessToken })
        } catch (error) {
            res.status(401).json({ error: "Invalid or expired refresh token" });

        }
    }

    //------------------------------------------------

    
}