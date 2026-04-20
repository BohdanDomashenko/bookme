import { Inject } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { EmailPayload, EmailService } from '../email.interface';

export const SMTP_CONFIG = 'SMTP_CONFIG';

export interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
}
export class SmtpProvider implements EmailService {
  transporter: Transporter;

  constructor(
    @Inject(SMTP_CONFIG)
    private readonly config: SmtpConfig,
  ) {
    this.transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: {
        user: config.user,
        pass: config.password,
      },
    });
  }

  async send(payload: EmailPayload) {
    const { to, subject, text, html } = payload;

    await this.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      text,
      html,
    });
  }
}
