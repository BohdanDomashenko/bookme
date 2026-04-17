import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { EVENTS } from 'src/common/constants/events.constants';
import { SignUpSuccessEvent } from 'src/modules/auth/events/sign-up-success.event';
import { AppEmailService } from '../email.service';

@Injectable()
export class WelcomeUserEmailListener {
  constructor(private readonly emailService: AppEmailService) {}

  @OnEvent(EVENTS.AUTH.SIGNUP_SUCCESS)
  async handleSignUpSuccessEvent(event: SignUpSuccessEvent) {
    await this.emailService.sendWelcomeEmail({
      email: event.payload.user.email,
      fullName: event.payload.user.full_name,
    });
  }
}
