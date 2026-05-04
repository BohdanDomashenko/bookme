import { Injectable } from '@nestjs/common';
import { type StripeClient } from 'src/common/types/stripe.types';
import { EnvService } from 'src/modules/env/env.service';
import Stripe from 'stripe';
import type {
  CreatePaymentInput,
  PaymentProviderPort,
} from '../ports/payment-provider.port';

@Injectable()
export class StripePaymentProvider implements PaymentProviderPort {
  constructor(
    private readonly envService: EnvService,
    private readonly stripe: StripeClient,
  ) {
    this.stripe = new Stripe(this.envService.get('STRIPE_SECRET_KEY'));
  }

  async createPayment(input: CreatePaymentInput) {
    const payment = await this.stripe.paymentIntents.create({
      amount: input.amount,
      currency: input.currency,
      metadata: {
        resource_type: input.resourceType,
        resource_id: input.resourceId,
      },
    });

    return {
      providerPaymentId: payment.id,
      extra: {
        clientSecret: payment.client_secret,
      },
    };
  }

  async confirmPayment(paymentId: string): Promise<void> {
    await this.stripe.paymentIntents.confirm(paymentId);
  }

  async refundPayment(paymentId: string): Promise<void> {
    throw new Error('Not implemented');
  }
}
