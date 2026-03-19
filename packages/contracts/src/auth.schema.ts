import { z } from 'zod';

export const otpLoginSchema = z.object({
  email: z.string().email(),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  code: z.string(),
});

export const signUpSchema = z.object({
  email: z.string().email(),
  full_name: z.string().max(100),
  country_id: z.string(),
  city: z.string().max(100),
});

export type OTPLoginSchema = z.infer<typeof otpLoginSchema>;
export type OTPVerifySchema = z.infer<typeof otpVerifySchema>;
export type SignUpSchema = z.infer<typeof signUpSchema>;
