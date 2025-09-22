import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import container from '../di/inversify.config'
import OwnerController from '../controllers/owner.controller'
import TYPES from '../di/types'
import { asyncHandler } from '../utils/async.handler'

const router = Router()
const ownerController = container.get<OwnerController>(TYPES.OwnerController)

router.get('/profile/me', authMiddleware, asyncHandler(ownerController.getProfile))

export default router
