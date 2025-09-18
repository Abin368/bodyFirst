import axiosInstance from './axiosInstance'
import axios from 'axios'

interface SignupRequestData {
  email: string
  role: string
}

interface SignupVerifyData {
  email: string
  otp: string
  fullName: string
  password: string
  role: string
}

// Login
export const loginUser = async (email: string, password: string, role: string) => {
  const response = await axiosInstance.post('/auth/login', { email, password, role })
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
  const response = await axiosInstance.post('/auth/signup/request-otp', data)
  return response.data
}

// Verify OTP
export const signupVerifyOtp = async (data: SignupVerifyData) => {
  const response = await axiosInstance.post('/auth/signup/verify-otp', data)
  return response.data
}

export const logoutUser = async () => {
  await axiosInstance.post('/auth/logout')
}

export const googleLogin = async (idToken: string, role: string) => {
  const response = await axiosInstance.post(
    '/auth/google',
    { idToken, role },
    { withCredentials: true }
  )

  return response.data
}

export const forgetRequestOtp = async (email: string, role: string) => {
  const response = await axiosInstance.post('/auth/forget/request-otp', { email, role })

  console.log('response', response)
  return response.data
}

export const forgetVerifyOtp = async (
  email: string,
  role: string,
  otp: string,
  resetToken: string
) => {
  const response = await axiosInstance.post('/auth/forget/verify-otp', {
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
  const response = await axiosInstance.post('/auth/reset-password', {
    password,
    confirmPassword,
    resetToken,
  })
  return response.data
}
