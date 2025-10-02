import jwt from 'jsonwebtoken'

import { DecodedToken, ITokenService } from '../../interfaces/services/ITokenService'

export default class TokenService implements ITokenService {
  generateAccessToken(payload: DecodedToken): string {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET!, { expiresIn: '15m' })
  }

  generateRefreshToken(payload: DecodedToken): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' })
  }

  verifyAccessToken(token: string): DecodedToken {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as DecodedToken
  }

  verifyRefreshToken(token: string): DecodedToken {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as DecodedToken
  }
}
