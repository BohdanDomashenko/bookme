const AUTH_EVENTS = {
  SIGNUP_SUCCESS: 'auth.signup.success',
  OTP_LOGIN_REQUEST: 'auth.otp.login.request',
} as const;

export const EVENTS = {
  AUTH: AUTH_EVENTS,
} as const;
