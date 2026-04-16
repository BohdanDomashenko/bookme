import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import { EmailPayload, EmailService } from "../email.interface";

export class SmtpProvider implements EmailService {
  transporter: Transporter;

  constructor() {
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