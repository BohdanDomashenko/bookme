import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { APP_THROTTLE_TTL } from 'src/common/constants/app.constants';
import { AuthService } from './auth.service';
import { OtpLoginDto, OtpVerifyDto, SignupDto } from './dto/auth.dto';

const OTP_SIGNUP_LIMIT = 3;
const OTP_LOGIN_LIMIT = 3;
const OTP_VERIFY_LIMIT = 3;
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a user account and sends a verification OTP.',
  })
  @ApiBody({ type: SignupDto })
  @Throttle({
    default: {
      ttl: APP_THROTTLE_TTL,
      limit: OTP_SIGNUP_LIMIT,
    },
  })
  @Post('sign-up')
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @ApiOperation({
    summary: 'Request login OTP',
    description:
      'Generates and sends a one-time password to the provided email.',
  })
  @ApiBody({ type: OtpLoginDto })
  @Throttle({
    default: {
      ttl: APP_THROTTLE_TTL,
      limit: OTP_LOGIN_LIMIT,
    },
  })
  @Post('otp-login')
  async otpLogin(@Body() body: OtpLoginDto) {
    return this.authService.otpLogin(body);
  }

  @ApiOperation({
    summary: 'Verify login OTP',
    description: 'Validates the OTP and returns authentication tokens.',
  })
  @ApiBody({ type: OtpVerifyDto })
  @Throttle({
    default: {
      ttl: APP_THROTTLE_TTL,
      limit: OTP_VERIFY_LIMIT,
    },
  })
  @Post('verify-otp')
  async otpVerify(@Body() body: OtpVerifyDto) {
    return this.authService.verifyOtp(body);
  }
}
