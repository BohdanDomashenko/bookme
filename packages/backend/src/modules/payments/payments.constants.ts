export const PAYMENT_STATUS = {
  PENDING: 'PENDING',
  SUCCEEDED: 'SUCCEEDED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED',
} as const;

export type PaymentStatus =
  (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const PAYMENT_RESOURCE_TYPE = {
  PROPERTY_BOOKING: 'PROPERTY_BOOKING',
} as const;

export type PaymentResourceType =
  (typeof PAYMENT_RESOURCE_TYPE)[keyof typeof PAYMENT_RESOURCE_TYPE];

export const PAYMENT_PROVIDERS = {
  STRIPE: 'STRIPE',
} as const;

export type PaymentProvider =
  (typeof PAYMENT_PROVIDERS)[keyof typeof PAYMENT_PROVIDERS];
