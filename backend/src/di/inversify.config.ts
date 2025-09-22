import { Container } from 'inversify'
import TYPES from './types'

//controllers
import AuthController from '../controllers/auth.controller'
import OwnerController from '../controllers/owner.controller'

//repository
import UserRepository from '../repositories/user.repository'
import OwnerProfileRepository from '../repositories/owner.repository'

//user services
import TokenService from '../services/token.service'
import OtpService from '../services/otp.service'
import EmailService from '../services/email.service'
import AuthService from '../services/auth.service'
import PasswordService from '../services/password.repository'

//owner side services
import OwnerService from '../services/owner.services'

const container = new Container()

container.bind<AuthService>(TYPES.AuthService).to(AuthService)
container.bind<UserRepository>(TYPES.UserRepository).to(UserRepository)
container.bind<TokenService>(TYPES.TokenService).to(TokenService)
container.bind<OtpService>(TYPES.OtpService).to(OtpService)
container.bind<EmailService>(TYPES.EmailService).to(EmailService)
container.bind<AuthController>(TYPES.AuthController).to(AuthController)
container.bind<PasswordService>(TYPES.PasswordService).to(PasswordService)

container.bind<OwnerController>(TYPES.OwnerController).to(OwnerController)
container.bind<OwnerService>(TYPES.OwnerService).to(OwnerService)
container.bind<OwnerProfileRepository>(TYPES.OwnerProfileRepository).to(OwnerProfileRepository)

export default container
