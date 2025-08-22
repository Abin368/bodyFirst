import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AuthService from "../services/AuthService";
import UserRepository from "../repositories/UserRepository";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

const userRepository = new UserRepository()

const authService = new AuthService(userRepository)

const authController= new AuthController(authService)

router.post('/login',authController.login)
router.post('/refresh',authController.refreshToken)

export default router