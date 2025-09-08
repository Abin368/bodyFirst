import { IUser } from "../models/IUser";

export interface IGoogleAuthService{
    getAuthUrl():string
    getUserInfo(code:string):Promise<Partial<IUser>>
}