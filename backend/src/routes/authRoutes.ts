import { Router } from 'express'
import AuthController from '../controllers/AuthController'
import AuthService from '../services/AuthService'
import UserRepository from '../repositories/UserRepository'
import TokenService from '../services/TokenService'
import EmailService from '../services/EmailService'
import OtpService from '../services/OtpService'

const router = Router()

const otpService = new OtpService()
const emailService = new EmailService()
const userRepository = new UserRepository()
const tokenService = new TokenService()

const authService = new AuthService(userRepository, tokenService, otpService, emailService)
const authController = new AuthController(authService, tokenService)

// OTP signup flow
router.post('/signup/request-otp', authController.requestOtp)
router.post('/signup/verify-otp', authController.verifyOtp)

// login & refresh
router.post('/login', authController.login)
router.post('/refresh', authController.refreshToken)
router.post('/logout', authController.logout)
export default router
