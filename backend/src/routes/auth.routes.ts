import { Router } from 'express'
import TYPES from '../di/types'
import container from '../di/inversify.config'
import AuthController from '../controllers/auth.controller'
import { asyncHandler } from '../utils/async.handler'

const router = Router()
const authController = container.get<AuthController>(TYPES.AuthController)

// OTP signup flow
router.post('/signup/request-otp', asyncHandler(authController.requestOtp))
router.post('/signup/verify-otp', asyncHandler(authController.verifyOtp))

// Login & refresh
router.post('/login', asyncHandler(authController.login))
router.post('/refresh', asyncHandler(authController.refreshToken))
router.post('/logout', asyncHandler(authController.logout))

router.post('/google', asyncHandler(authController.googleLogin))

// Forget password flow
router.post('/forget/request-otp', asyncHandler(authController.forgetOtp))
router.post('/forget/verify-otp', asyncHandler(authController.verifyForgetOtp))

router.post('/reset-password', asyncHandler(authController.resetPassword))

export default router
