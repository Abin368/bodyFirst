const TYPES = {
  AuthService: Symbol.for('AuthService'),
  AuthController: Symbol.for('AuthController'),
  UserRepository: Symbol.for('UserRepository'),
  TokenService: Symbol.for('TokenService'),
  EmailService: Symbol.for('EmailService'),
  OtpService: Symbol.for('OtpService'),
  PasswordService: Symbol.for('PasswordService'),
  OwnerService: Symbol.for('OwnerService'),
  OwnerController: Symbol.for('OwnerController'),
  OwnerProfileRepository: Symbol.for('OwnerProfileRepository'),
  S3Repository: Symbol.for('S3Repository'),
  OwnerGymRepository: Symbol.for('OwnerGymRepository'),
  ImageService: Symbol.for('ImageService'),
  StripeServices: Symbol.for('StripeServices'),
  StripeWebhookService:Symbol.for('StripeWebhookService'),
  StripeWebhookController:Symbol.for('StripeWebhookController'),
  OwnerPaymentRepository:Symbol.for('OwnerPaymentRepository'),
  StripeClient: Symbol.for('StripeClient'),
  StripeEventLogRepository:Symbol.for('StripeEventLogRepository')
}

export default TYPES
