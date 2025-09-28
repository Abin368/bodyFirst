import axiosInstance from './axiosInstance'
import axios from 'axios'
import type { SignupRequestData, SignupVerifyData } from '@/types/auth'
import { API_ROUTES } from '@/constants/apiRoutes'

// Login
export const loginUser = async (email: string, password: string, role: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.LOGIN, { email, password, role })
  return response.data
}

export const refreshAccessToken = async () => {
  const response = await axios.post(
    'http://localhost:8000/api/auth/refresh',
    {},
    { withCredentials: true }
  )
  return response.data
}

// Request OTP
export const signupRequestOtp = async (data: SignupRequestData) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.SIGNUP_REQUEST_OTP, data)
  return response.data
}

// Verify OTP
export const signupVerifyOtp = async (data: SignupVerifyData) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.SIGNUP_VERIFY_OTP, data)
  return response.data
}

export const logoutUser = async () => {
  await axiosInstance.post(API_ROUTES.AUTH.LOGOUT)
}

export const googleLogin = async (idToken: string, role: string) => {
  const response = await axiosInstance.post(
    API_ROUTES.AUTH.GOOGLE,
    { idToken, role },
    { withCredentials: true }
  )

  return response.data
}

export const forgetRequestOtp = async (email: string, role: string) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.FORGET_REQUEST_OTP, { email, role })

  return response.data
}

export const forgetVerifyOtp = async (
  email: string,
  role: string,
  otp: string,
  resetToken: string
) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.FORGET_VERIFY_OTP, {
    email,
    role,
    otp,
    resetToken,
  })
  return response.data
}

export const resetPassword = async (
  password: string,
  confirmPassword: string,
  resetToken: string
) => {
  const response = await axiosInstance.post(API_ROUTES.AUTH.RESET_PASSWORD, {
    password,
    confirmPassword,
    resetToken,
  })
  return response.data
}
