import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CheckoutSessionCompletedHandler } from './events/handlers/checkout-session-completed.handler';
import { STRIPE_EVENT_HANDLERS } from './events/stripe-event-handler.registry';
import { STRIPE_WEBHOOK_QUEUE_NAME } from './stripe-webhook.constants';
import { StripeWebhookController } from './stripe-webhook.controller';
import { StripeWebhookProcessor } from './stripe-webhook.processor';
import { StripeWebhookService } from './stripe-webhook.service';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    BullModule.registerQueue({
      name: STRIPE_WEBHOOK_QUEUE_NAME,
    }),
  ],
  controllers: [StripeWebhookController],
  providers: [
    StripeWebhookService,
    StripeWebhookProcessor,
    {
      provide: STRIPE_EVENT_HANDLERS,
      useFactory: (
        checkoutSessionCompletedHandler: CheckoutSessionCompletedHandler,
      ) => [checkoutSessionCompletedHandler],
      inject: [CheckoutSessionCompletedHandler],
    },
  ],
})
export class StripeWebhookModule {}
