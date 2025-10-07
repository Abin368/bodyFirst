export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    GOOGLE: '/auth/google',

    SIGNUP_REQUEST_OTP: '/auth/signup/request-otp',
    SIGNUP_VERIFY_OTP: '/auth/signup/verify-otp',

    FORGET_REQUEST_OTP: '/auth/forget/request-otp',
    FORGET_VERIFY_OTP: '/auth/forget/verify-otp',
    RESET_PASSWORD: '/auth/reset-password',
  },

  OWNER: {
    PROFILE_ME: '/owner/profile/me',
    UPLOAD_IMG: '/owner/gym/upload-image',
    FINALIZE_GYM: '/owner/gym/finalize',
    CREATE_CHECKOUT_SESSION: '/owner/stripe/create-checkout-session',
  },
  MEMBER: {
    PROFILE_ME: '/member/profile/me',
    UPLOAD_IMG: '/member/gym/upload-image',
    FINALIZE_GYM: '/member/profile/finalize',
  },
  GYM: {
    GET_GYM: '/gym/complete/list',
  },
}
