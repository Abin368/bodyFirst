import { Container } from 'inversify'
import TYPES from './types'

import AuthController from '../controllers/auth.controller'

import UserRepository from '../repositories/user.repository'

import TokenService from '../services/token.service'
import OtpService from '../services/otp.service'
import EmailService from '../services/email.service'
import AuthService from '../services/auth.service'
import PasswordService from '../services/password.repository'

const container = new Container()

container.bind<AuthService>(TYPES.AuthService).to(AuthService)
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<TokenService>(TYPES.TokenService).to(TokenService)
container.bind<OtpService>(TYPES.OtpService).to(OtpService)
container.bind<EmailService>(TYPES.EmailService).to(EmailService)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<PasswordService>(TYPES.PasswordService).to(PasswordService)

export default container
