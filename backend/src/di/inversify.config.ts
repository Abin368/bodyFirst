import { Container } from 'inversify'
import TYPES from './types'

import AuthController from '../controllers/AuthController'

import UserRepository from '../repositories/UserRepository'

import TokenService from '../services/TokenService'
import OtpService from '../services/OtpService'
import EmailService from '../services/EmailService'
import AuthService from '../services/AuthService'
import PasswordService from '../services/PasswordService'

const container = new Container()

container.bind<AuthService>(TYPES.AuthService).to(AuthService)
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<TokenService>(TYPES.TokenService).to(TokenService)
container.bind<OtpService>(TYPES.OtpService).to(OtpService)
container.bind<EmailService>(TYPES.EmailService).to(EmailService)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<PasswordService>(TYPES.PasswordService).to(PasswordService)

export default container
