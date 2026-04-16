export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html: string;
}

export const EMAIL_SERVICE = Symbol('EMAIL_SERVICE');

export interface EmailService {
  send(payload: EmailPayload): Promise<void>;
}