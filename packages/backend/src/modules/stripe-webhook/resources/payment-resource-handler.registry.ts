// payment-resource-handler.registry.ts
import { Injectable } from '@nestjs/common';
import { PaymentResourceType } from 'generated/prisma/enums';
import { PaymentResourceHandler } from './payment-resource-handler.interface';

export const PAYMENT_RESOURCE_HANDLERS = Symbol('PAYMENT_RESOURCE_HANDLERS');

@Injectable()
export class PaymentResourceHandlerRegistry {
  private readonly handlers = new Map<
    PaymentResourceType,
    PaymentResourceHandler
  >();

  constructor(handlers: PaymentResourceHandler[]) {
    for (const handler of handlers) {
      this.handlers.set(handler.type, handler);
    }
  }

  get(resourceType: PaymentResourceType) {
    return this.handlers.get(resourceType);
  }
}
