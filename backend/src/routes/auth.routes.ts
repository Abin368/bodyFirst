import { Router } from 'express'
import TYPES from '../di/types'
import container from '../di/inversify.config'
import AuthController from '../controllers/auth.controller'
import { asyncHandler } from '../utils/async.handler'
import { ROUTES } from '../enums/routes.constant'

const router = Router()
const authController = container.get<AuthController>(TYPES.AuthController)

router.post(ROUTES.AUTH.SIGNUP_REQUEST_OTP, asyncHandler(authController.requestOtp))
router.post(ROUTES.AUTH.SIGNUP_VERIFY_OTP, asyncHandler(authController.verifyOtp))

// Login & refresh
router.post(ROUTES.AUTH.LOGIN, asyncHandler(authController.login))
router.post(ROUTES.AUTH.REFRESH, asyncHandler(authController.refreshToken))
router.post(ROUTES.AUTH.LOGOUT, asyncHandler(authController.logout))

// Google login
router.post(ROUTES.AUTH.GOOGLE, asyncHandler(authController.googleLogin))

// Forget password flow
router.post(ROUTES.AUTH.FORGET_REQUEST_OTP, asyncHandler(authController.forgetOtp))
router.post(ROUTES.AUTH.FORGET_VERIFY_OTP, asyncHandler(authController.verifyForgetOtp))
router.post(ROUTES.AUTH.RESET_PASSWORD, asyncHandler(authController.resetPassword))

export default router
