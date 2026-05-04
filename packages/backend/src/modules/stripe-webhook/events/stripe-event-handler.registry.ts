import { Inject, Injectable } from '@nestjs/common';
import { StripeEventType } from 'src/common/types/stripe.types';
import { StripeEventHandler } from './stripe-event-handler.interface';

export const STRIPE_EVENT_HANDLERS = Symbol('STRIPE_EVENT_HANDLERS');
@Injectable()
export class StripeEventHandlerRegistry {
  private readonly handlers = new Map<StripeEventType, StripeEventHandler>();

  constructor(@Inject(STRIPE_EVENT_HANDLERS) handlers: StripeEventHandler[]) {
    for (const handler of handlers) {
      this.handlers.set(handler.type, handler);
    }
  }

  get(type: StripeEventType) {
    return this.handlers.get(type);
  }
}
