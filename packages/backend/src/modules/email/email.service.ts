import { Inject, Injectable } from '@nestjs/common';
import { EMAIL_SERVICE } from './email.interface';
import type { EmailService } from './email.interface';

@Injectable()
export class AppEmailService {
  constructor(
    @Inject(EMAIL_SERVICE)
    private readonly emailService: EmailService,
  ) {}

  async sendWelcomeEmail(data: {
    email: string;
    fullName: string;
  }) {
    const { email, fullName } = data;

    await this.emailService.send({
      to: email,
      subject: 'Welcome to our platform',
      text: `Welcome to our platform, ${fullName}`,
      html: `<p>Welcome to our platform, ${fullName}</p>`,
    });
  }

  async sendOtpLoginEmail(data: {
    email: string;
    fullName: string;
    otp: string;
  }) {
    const { email, fullName, otp } = data;

    await this.emailService.send({
      to: email,
      subject: 'OTP Login Request',
      text: `Your OTP for login is ${otp} for ${fullName}`,
      html: `<p>Your OTP for login is ${otp} for ${fullName}</p>`,
    });
  }
}
