import {
  otpLoginSchema,
  otpVerifySchema,
  signUpSchema,
} from '@packages/contracts';
import { createZodDto } from 'nestjs-zod';

export class SignupDto extends createZodDto(signUpSchema) {}
export class OtpLoginDto extends createZodDto(otpLoginSchema) {}
export class OtpVerifyDto extends createZodDto(otpVerifySchema) {}
