// routes/authRoutes.ts
import { Router } from "express";
import AuthController from "../controllers/AuthController";
import AuthService from "../services/AuthService";
import UserRepository from "../repositories/UserRepository";
import OwnerProfileRepository from "../repositories/OwnerProfileRepository";

const router = Router();

const userRepository = new UserRepository();
const ownerRepository = new OwnerProfileRepository();
const authService = new AuthService(userRepository, ownerRepository);
const authController = new AuthController(authService);

// OTP signup flow
router.post('/signup/request-otp', authController.requestOtp); 
router.post('/signup/verify-otp', authController.verifyOtp);   

// login & refresh
router.post('/login', authController.login);
router.post('/refresh', authController.refreshToken);


export default router;
