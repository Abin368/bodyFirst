
// import { redisClient } from "../config/redis";

// export function generateOtp(): string {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// }

// export async function storeOtp(email: string, otp: string, ttl = 300) {

//   await redisClient.set(`otp:${email}`, otp, { EX: ttl });
// }

// export async function verifyOtp(email: string, otp: string): Promise<boolean> {
//   const stored = await redisClient.get(`otp:${email}`);
//   console.log('email from otp.ts',email)
//   console.log('stored',stored)
//   if (stored === otp) {
//     await redisClient.del(`otp:${email}`);
//     return true;
//   }
//   return false;
// }
