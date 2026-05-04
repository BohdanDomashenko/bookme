import { Injectable } from '@nestjs/common';
import { PAYMENT_PROVIDERS, PaymentProvider } from '../payments.constants';
import { StripePaymentProvider } from '../providers/stripe-payment.provider';

@Injectable()
export class PaymentProviderFactory {
  constructor(private readonly stripePaymentProvider: StripePaymentProvider) {}

  get(provider: PaymentProvider) {
    switch (provider) {
      case PAYMENT_PROVIDERS.STRIPE:
        return this.stripePaymentProvider;
      default:
        throw new Error(`Payment provider ${provider} not supported`);
    }
  }
}
