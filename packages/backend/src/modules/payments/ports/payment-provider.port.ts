import { PaymentResourceType } from 'generated/prisma/enums';

export interface CreatePaymentInput {
  /**
   * Amount in cents
   */
  amount: number;
  currency: string;
  resourceType: PaymentResourceType;
  resourceId: string;
}

export interface ConfirmPaymentResponse<
  T extends Record<string, unknown> = Record<string, unknown>,
> {
  providerPaymentId: string;
  extra: T;
}

export interface PaymentProviderPort {
  createPayment(input: CreatePaymentInput): Promise<ConfirmPaymentResponse>;
  confirmPayment(paymentId: string): Promise<void>;
  refundPayment(paymentId: string): Promise<void>;
}
