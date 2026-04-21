import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { EnvModule } from '../env/env.module';
import { PrismaModule } from '../prisma/prisma.module';
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
  providers: [StripeWebhookService, StripeWebhookProcessor],
})
export class StripeWebhookModule {}
