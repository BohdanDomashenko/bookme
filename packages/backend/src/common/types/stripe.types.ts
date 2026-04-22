import Stripe from 'stripe';

type StripeClient = InstanceType<typeof Stripe>;

export type StripeEvent = ReturnType<
  StripeClient['webhooks']['constructEvent']
>;

export type StripeEventType = StripeEvent['type'];
