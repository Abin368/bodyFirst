import { Role } from "./role"

export interface Tokens {
  accessToken: string
  refreshToken: string
  role: Role
  userId: string
}