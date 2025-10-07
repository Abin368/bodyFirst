import { Container } from 'inversify'
import TYPES from './types'
import Stripe from 'stripe'

//controllers
import AuthController from '../controllers/auth.controller'
import OwnerController from '../controllers/owner.controller'
import { StripeWebhookController } from '../controllers/stripe.webhook.controller'
import MemberController from '../controllers/member.controller'
import GymController from '../controllers/gym.controller'
//repository
import UserRepository from '../repositories/user/user.repository'
import OwnerProfileRepository from '../repositories/owner/owner.profile.repository'
import S3Repository from '../repositories/common/s3.repository'
import OwnerGymRepository from '../repositories/owner/owner.gym.repository'
import { OwnerPaymentRepository } from '../repositories/owner/OwnerPaymentRepository'
import MemberRepository from '../repositories/member/member.repositories'
import GymRepository from '../repositories/gym/gym.repository'

//user services
import TokenService from '../services/common/token.service'
import OtpService from '../services/common/otp.service'
import EmailService from '../services/common/email.service'
import AuthService from '../services/user/auth.service'
import PasswordService from '../services/common/password.repository'
import { ImageService } from '../services/common/image.service'
import SubscriptionService from '../services/stripe/subscription.service'
import MemberService from '../services/member/member.service'
import GymService from '../services/gym/gym.service'

//owner side services
import OwnerService from '../services/owner/owner.services'
import StripeServices from '../services/stripe/stripe.service'
import { StripeEventLogRepository } from '../repositories/common/stripeEventLog.repository'
import { StripeWebhookService } from '../services/stripe/stripe.webhook.service'
import { IStripeWebhookService } from '../interfaces/services/stripe/IStripeWebhookService'

const container = new Container()

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2025-08-27.basil',
})

container.bind<Stripe>(TYPES.StripeClient).toConstantValue(stripe)

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

container.bind<S3Repository>(TYPES.S3Repository).to(S3Repository)
container.bind<OwnerGymRepository>(TYPES.OwnerGymRepository).to(OwnerGymRepository)
container.bind<ImageService>(TYPES.ImageService).to(ImageService)
container.bind<StripeServices>(TYPES.StripeServices).to(StripeServices)
container.bind<IStripeWebhookService>(TYPES.StripeWebhookService).to(StripeWebhookService)
container.bind<StripeWebhookController>(TYPES.StripeWebhookController).to(StripeWebhookController)
container
  .bind<StripeEventLogRepository>(TYPES.StripeEventLogRepository)
  .to(StripeEventLogRepository)

container.bind<OwnerPaymentRepository>(TYPES.OwnerPaymentRepository).to(OwnerPaymentRepository)
container.bind<SubscriptionService>(TYPES.SubscriptionService).to(SubscriptionService)

container.bind<MemberController>(TYPES.MemberController).to(MemberController)
container.bind<MemberService>(TYPES.MemberService).to(MemberService)
container.bind<MemberRepository>(TYPES.MemberRepository).to(MemberRepository)

container.bind<GymController>(TYPES.GymController).to(GymController)
container.bind<GymService>(TYPES.GymService).to(GymService)
container.bind<GymRepository>(TYPES.GymRepository).to(GymRepository)

export default container
