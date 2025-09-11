import { NextFunction, Request, Response } from "express";

export interface IAuthController {
    requestOtp(req: Request, res: Response,next:NextFunction): Promise<void>;
    verifyOtp(req: Request, res: Response,next:NextFunction): Promise<void>;
    login(req: Request, res: Response,next:NextFunction): Promise<void>;
    refreshToken(req: Request, res: Response,next:NextFunction): Promise<void>;
    logout(req: Request, res: Response,next:NextFunction): Promise<void>;
    googleLogin(req: Request, res: Response,next:NextFunction): Promise<void>;
    forgetOtp(req: Request, res: Response,next:NextFunction): Promise<void>
    verifyForgetOtp(req: Request, res: Response,next:NextFunction): Promise<void>
    resetPassword(req: Request, res: Response,next:NextFunction): Promise<void>
}