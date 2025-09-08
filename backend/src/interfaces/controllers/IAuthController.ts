import { Request,Response } from "express";

export interface IAuthController{
    requestOtp(req:Request,res:Response):Promise<void>;
    verifyOtp(req:Request,res:Response):Promise<void>;
    login(req:Request,res:Response):Promise<void>;
    refreshToken(req:Request,res:Response):Promise<void>;
    logout(req:Request,res:Response):Promise<void>;
    googleLogin(req:Request,res:Response):Promise<void>;
}