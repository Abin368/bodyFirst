import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import container from '../di/inversify.config'
import TYPES from '../di/types'
import { asyncHandler } from '../utils/async.handler'
import { ROUTES } from '../enums/routes.constant'
import GymController from '../controllers/gym.controller'

const router = Router()

const gymController = container.get<GymController>(TYPES.GymController)

router.get(ROUTES.GYM.GET_GYMS, authMiddleware, asyncHandler(gymController.getGyms))

export default router
