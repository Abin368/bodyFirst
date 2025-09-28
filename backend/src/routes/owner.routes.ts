import { Router } from 'express'
import multer from 'multer'
import { authMiddleware } from '../middlewares/auth.middleware'
import container from '../di/inversify.config'
import OwnerController from '../controllers/owner.controller'
import TYPES from '../di/types'
import { asyncHandler } from '../utils/async.handler'
import { ROUTES } from '../enums/routes.constant'

const router = Router()
const upload = multer()
const ownerController = container.get<OwnerController>(TYPES.OwnerController)

router.get(ROUTES.OWNER.PROFILE_ME, authMiddleware, asyncHandler(ownerController.getProfile))
router.post(
  ROUTES.OWNER.UPLOAD_IMG,
  authMiddleware,
  upload.single('file'),
  asyncHandler(ownerController.uploadImg)
)
router.post(ROUTES.OWNER.SUBMIT_GYM, authMiddleware, asyncHandler(ownerController.uploadGym))
export default router
