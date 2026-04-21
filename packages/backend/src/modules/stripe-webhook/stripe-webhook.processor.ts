import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import type { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';
import {
  STRIPE_WEBHOOK_EXTERNAL_STATUS,
  STRIPE_WEBHOOK_JOB_NAME,
  STRIPE_WEBHOOK_QUEUE_NAME,
  STRIPE_WEBHOOK_STATUS,
} from './stripe-webhook.constants';

type StripeWebhookJobPayload = {
  eventId: string;
};

@Processor(STRIPE_WEBHOOK_QUEUE_NAME)
export class StripeWebhookProcessor extends WorkerHost {
  private readonly logger = new Logger(StripeWebhookProcessor.name);

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async process(job: Job<StripeWebhookJobPayload>) {
    if (job.name !== STRIPE_WEBHOOK_JOB_NAME) {
      return;
    }

    const updatedWebhookEvent =
      await this.prismaService.stripeWebhookEvent.update({
        where: {
          eventId: job.data.eventId,
          status: { not: STRIPE_WEBHOOK_STATUS.PROCESSED },
        },
        data: {
          status: STRIPE_WEBHOOK_STATUS.PROCESSING,
          attempts: {
            increment: 1,
          },
        },
      });

    if (!updatedWebhookEvent) {
      return;
    }

    try {
      await this.handleEventType(
        updatedWebhookEvent.type,
        updatedWebhookEvent.payload,
      );

      await this.prismaService.stripeWebhookEvent.update({
        where: {
          eventId: updatedWebhookEvent.eventId,
        },
        data: {
          status: STRIPE_WEBHOOK_STATUS.PROCESSED,
          lastError: null,
        },
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unexpected processing error';

      await this.prismaService.stripeWebhookEvent.update({
        where: {
          eventId: updatedWebhookEvent.eventId,
        },
        data: {
          status: STRIPE_WEBHOOK_STATUS.FAILED,
          lastError: errorMessage,
        },
      });

      throw error;
    }
  }

  private async handleEventType(type: string, _payload: unknown) {
    if (type in STRIPE_WEBHOOK_EXTERNAL_STATUS) {
      this.logger.log(`Handled Stripe event ${type}`);
      return;
    }

    this.logger.log(`Ignoring unsupported Stripe event ${type}`);
  }
}
