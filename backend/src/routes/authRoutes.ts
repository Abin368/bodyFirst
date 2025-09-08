import { Router } from 'express'
import TYPES from '../di/types'
import container from '../di/inversify.config'
import AuthController from '../controllers/AuthController'

const router = Router()


const authController = container.get<AuthController>(TYPES.AuthController)

// OTP signup flow
router.post('/signup/request-otp', (req, res) => authController.requestOtp(req, res))
router.post('/signup/verify-otp', (req, res) => authController.verifyOtp(req, res))

// Login & refresh
router.post('/login', (req, res) => authController.login(req, res))
router.post('/refresh', (req, res) => authController.refreshToken(req, res))
router.post('/logout', (req, res) => authController.logout(req, res))

router.post("/google", authController.googleLogin)


export default router
