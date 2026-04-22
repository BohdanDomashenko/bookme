import { Injectable } from '@nestjs/common';
import { StripeEventType } from 'src/common/types/stripe.types';
import { StripeEventHandler } from './stripe-event-handler.interface';

@Injectable()
export class StripeEventHandlerRegistry {
  private readonly handlers = new Map<StripeEventType, StripeEventHandler>();

  constructor(handlers: StripeEventHandler[]) {
    for (const handler of handlers) {
      this.handlers.set(handler.type, handler);
    }
  }

  get(type: StripeEventType) {
    return this.handlers.get(type);
  }
}
