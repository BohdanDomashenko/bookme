import { Injectable } from '@nestjs/common';
import { StripeEvent } from 'src/common/types/stripe.types';
import { StripeEventHandler } from '../stripe-event-handler.interface';

@Injectable()
export class CheckoutSessionCompletedHandler
  implements StripeEventHandler<'checkout.session.completed'>
{
  readonly type = 'checkout.session.completed';

  async handle(event: StripeEvent) {
    console.log(event);
  }
}
