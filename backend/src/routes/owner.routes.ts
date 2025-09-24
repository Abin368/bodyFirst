import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import container from '../di/inversify.config'
import OwnerController from '../controllers/owner.controller'
import TYPES from '../di/types'
import { asyncHandler } from '../utils/async.handler'
import { ROUTES } from '../enums/routes.constant'

const router = Router()
const ownerController = container.get<OwnerController>(TYPES.OwnerController)

router.get(ROUTES.OWNER.PROFILE_ME, authMiddleware, asyncHandler(ownerController.getProfile))

export default router
