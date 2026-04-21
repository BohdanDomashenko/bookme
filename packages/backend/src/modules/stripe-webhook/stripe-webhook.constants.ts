export const STRIPE_WEBHOOK_QUEUE_NAME = 'stripe-webhooks';
export const STRIPE_WEBHOOK_JOB_NAME = 'process-stripe-event';
export const STRIPE_WEBHOOK_ATTEMPTS = 8;
export const STRIPE_WEBHOOK_BACKOFF_DELAY = 1000;

export const STRIPE_WEBHOOK_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  PROCESSED: 'processed',
  FAILED: 'failed',
} as const;

export const STRIPE_WEBHOOK_EXTERNAL_STATUS = {
  'checkout.session.completed': true,
  'invoice.payment_failed': true,
} as const;
