export const MESSAGES = {
  OTP: {
    SENT: 'OTP sent successfully',
    VERIFIED: 'OTP verified successfully',
    INVALID: 'Invalid or expired OTP provided',
    FAILED: 'Failed to send OTP',
  },
  USER: {
    CREATED: 'User registered successfully',
    ALREADY_EXISTS: 'User already exists',
    NOT_FOUND: 'User not found',
  },
  AUTH: {
    LOGIN_SUCCESS: 'Login successful',
    LOGOUT_SUCCESS: 'Logout successful',
    UNAUTHORIZED: 'Unauthorized access',
    PASSWORD_RESET: 'Password reset successful',
    GOOGLETOKEN_INVALID: 'Invalid Google token',
    INVALID_CREDENTIALS: 'Invalid credentials',
    INVALID_ROLE: 'Invalid role in token',
    PASSWORD_MISSMATCH: 'Passwords do not match',
    SESSION_EXPIRED: 'Reset session not verified or expired',
  },
  COMMON: {
    SERVER_ERROR: 'Something went wrong, please try again later',
    SUCCESS: 'Operation successful',
    FAILED: 'Operation failed',
  },

  OWNER: {
    PROFILE_FETCHED_SUCCESS: 'Owner profile fetched successfully',
    NO_FILE: 'No File uploaded',
    FILE_UPLOAD_SUCCESS: 'Image uploaded successfully',
    FILE_UPLOAD_FAILED: 'File upload failed',
    INVALID_FILE_UPLOAD: 'Invalid file uploaded',
    FILE_MOVE_FAILED: 'File move failed',
    FILE_DELETE_FAILED: 'File delete failed',
    GYM_CREATED_SUCCESS: 'Gym created successfully',
    GYM_CREATION_FAILED: 'Gym creation failed',
    CHECKOUT_SUCCESS:'Checkout session created successfully',
    CHECKOUT_FAILED:'Failed to create Stripe Checkout session',
    FILE_TOO_LARGE:'File is too large'
  },

    STRIPE: {
      INVALID_PAYLOAD: 'Invalid or missing webhook payload',
      INVALID_SIGNATURE: 'Invalid Stripe signature',
      WEBHOOK_RECEIVED: 'Webhook received successfully',
    
    },

}
