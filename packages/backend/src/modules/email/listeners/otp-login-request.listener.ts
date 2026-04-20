import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/constants/events.constants';
import { OtpLoginRequestEvent } from 'src/modules/auth/events/otp-login-request.event';
import { AppEmailService } from '../email.service';

@Injectable()
export class OtpLoginRequestListener {
  constructor(private readonly emailService: AppEmailService) {}

  @OnEvent(EVENTS.AUTH.OTP_LOGIN_REQUEST)
  async handleOtpLoginRequestEvent(event: OtpLoginRequestEvent) {
    await this.emailService.sendOtpLoginEmail({
      email: event.payload.user.email,
      fullName: event.payload.user.full_name,
      otp: event.payload.otp,
    });
  }
}
