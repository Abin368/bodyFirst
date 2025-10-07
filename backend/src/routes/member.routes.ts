import { Router } from 'express'
import { authMiddleware } from '../middlewares/auth.middleware'
import container from '../di/inversify.config'
import TYPES from '../di/types'
import { asyncHandler } from '../utils/async.handler'
import { ROUTES } from '../enums/routes.constant'
import MemberController from '../controllers/member.controller'
import multer from 'multer'
import { restricedFileUpload } from '../middlewares/restricted.file.uploads'
const router = Router()
const upload = multer()

const memberController = container.get<MemberController>(TYPES.MemberController)

router.get(
  ROUTES.MEMBER.GET_PROFILE,
  authMiddleware,
  asyncHandler(memberController.getMemberProfile)
)
router.post(
  ROUTES.MEMBER.UPLOAD_IMG,
  authMiddleware,

  upload.single('file'),
  restricedFileUpload,
  asyncHandler(memberController.uploadProfileImg)
)

router.post(
  ROUTES.MEMBER.SUBMIT_PROFILE,
  authMiddleware,
  asyncHandler(memberController.uploadProfile)
)

export default router
