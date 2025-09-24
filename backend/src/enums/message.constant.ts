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
  },
}
