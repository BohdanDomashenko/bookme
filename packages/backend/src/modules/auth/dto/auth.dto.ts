import { signUpSchema } from '@packages/contracts';
import { createZodDto } from 'nestjs-zod';

export class SignupDto extends createZodDto(signUpSchema) {}
export class OtpLoginDto extends createZodDto(signUpSchema) {}
export class OtpVerifyDto extends createZodDto(signUpSchema) {}
