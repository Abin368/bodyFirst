import { Role } from "../models/User";

export interface DecodedToken {
    userId: string;
    role: Role;
    gymId?: string;
}

export interface ITokenService {
    generateAccessToken(payload: DecodedToken): string;
    generateRefreshToken(payload: { userId: string }): string;
    verifyAccessToken(token: string): DecodedToken;
    verifyRefreshToken(token: string): { userId: string; role: string; gymId?: string }; // raw string role
}
