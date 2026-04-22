import { StripeEvent, StripeEventType } from 'src/common/types/stripe.types';

export interface StripeEventHandler<
  EventType extends StripeEventType = StripeEventType,
> {
  readonly type: EventType;
  handle(event: StripeEvent): Promise<void>;
}
