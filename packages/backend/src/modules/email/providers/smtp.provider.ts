import { Inject } from '@nestjs/common';
import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { EmailPayload, EmailService } from '../email.interface';

export const SMTP_CONFIG = 'SMTP_CONFIG';
export class SmtpProvider implements EmailService {
  transporter: Transporter;

  constructor(
    /*     @Inject(SMTP_CONFIG)
    private readonly config: {
      host: string;
      port: number;
      user: string;
      password: string;
    }, */
  ) {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
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
