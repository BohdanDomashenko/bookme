import type { OTPLoginSchema, OTPVerifySchema, SignUpSchema } from '@packages/contracts';
import type { VerifyOtpResponse } from '../types/auth.types';
import { api } from './api';

export const authApi = {
  async signUp(payload: SignUpSchema): Promise<void> {
    await api.post('/auth/sign-up', payload);
  },
  async signIn(payload: OTPLoginSchema): Promise<void> {
    await api.post('/auth/otp-login', payload);
  },
  async verifyOtp(payload: OTPVerifySchema): Promise<VerifyOtpResponse> {
    const { data } = await api.post<VerifyOtpResponse>('/auth/verify-otp', payload);
    return data;
  },
};
