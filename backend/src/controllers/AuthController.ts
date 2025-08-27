import { Request, Response } from "express";
import { RequestOtpSchema,VerifyOtpSchema,LoginSchema } from "../dtos/auth.dto";
import { DecodedToken, ITokenService } from "../interfaces/ITokenService";
import { IAuthService } from "../interfaces/IAuthService";


export default class AuthController {
    private authService: IAuthService;
    private tokenService :ITokenService;
    constructor(authService: IAuthService,tokenService :ITokenService) {
        this.authService = authService;
        this.tokenService=tokenService
    }
    //--------------------------------

    requestOtp = async (req: Request, res: Response) => {
        try {
            const body = RequestOtpSchema.parse(req.body)
            
            await this.authService.requestSignup(body.email,body.role)
            res.status(200).json({ message: 'OTP sent successfully' })
            
        } catch (error: any) {
            console.error("Request OTP error:", error);
            if (error.message === 'User already exists') {
                return res.status(400).json({ message: "User already exists" });
            }
            if (error.name === "ZodError") {
                return res.status(400).json({ message: error.errors });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //---------------------------------------

    verifyOtp = async (req: Request, res: Response) => {
        try {
           const body = VerifyOtpSchema.parse(req.body)
          

            const result = await this.authService.verifySignupOtp(body.email, body.otp,body.fullName,body.password,body.role)
           

           
            res.status(201).json({ message: "OTP verified.." ,...result});

        } catch (error: any) {

                 if (error.name === "ZodError") {
                return res.status(400).json({ message: error.errors });
            }
            res.status(400).json({ message: error.message });
        }
    }


    //---------------------------------------------
    login = async (req: Request, res: Response) => {
        try {
           const body = LoginSchema.parse(req.body)

            const tokens = await this.authService.login(body.email, body.password);

            res.cookie('refreshToken', tokens.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                 maxAge: 7 * 24 * 60 * 60 * 1000 
            })

            res.status(200).json({ accessToken: tokens.accessToken })
        } catch (error: any) {
            if (error.message === "Invalid credentials") {
                return res.status(401).json({ message: "Invalid credentials" });
            }

            if (error.name === "ZodError") {
                return res.status(400).json({ message: 'Validation Failed',details :error.errors });
            }
            res.status(500).json({ message: "Internal server error" });
        }
    }

    //----------------------------------------
    refreshToken = async (req: Request, res: Response) => {
        const token = req.cookies.refreshToken

        if (!token) return res.status(401).json({ error: 'Unauthorized' })

        try {
            const decoded= this.tokenService.verifyRefreshToken(token) as DecodedToken
            const newAccessToken = this.tokenService.generateAccessToken(decoded)
            res.status(200).json({ accessToken: newAccessToken })
        } catch (error) {
            res.status(401).json({ message: "Invalid or expired refresh token" });

        }
    }

    //------------------------------------------------

    
}