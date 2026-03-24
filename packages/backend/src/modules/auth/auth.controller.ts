import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { OtpLoginDto, OtpVerifyDto, SignupDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Post('otp-login')
  async otpLogin(@Body() body: OtpLoginDto) {
    return this.authService.otpLogin(body);
  }

  @Post('verify-otp')
  async otpVerify(@Body() body: OtpVerifyDto) {
    return this.authService.verifyOtp(body);
  }
}
