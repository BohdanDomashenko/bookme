import { InjectQueue } from '@nestjs/bullmq';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import { PRISMA_ERROR_CODES } from 'src/common/constants/prisma.constants';
import { isPrismaInputJsonValue } from 'src/common/utils/json.utils';
import Stripe from 'stripe';
import { EnvService } from '../env/env.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  STRIPE_WEBHOOK_ATTEMPTS,
  STRIPE_WEBHOOK_BACKOFF_DELAY,
  STRIPE_WEBHOOK_JOB_NAME,
  STRIPE_WEBHOOK_QUEUE_NAME,
  STRIPE_WEBHOOK_STATUS,
} from './stripe-webhook.constants';

type StripeClient = InstanceType<typeof Stripe>;
type StripeEvent = ReturnType<StripeClient['webhooks']['constructEvent']>;

@Injectable()
export class StripeWebhookService {
  private readonly stripeClient: StripeClient;
  private readonly webhookSecret: string;

  constructor(
    private readonly prismaService: PrismaService,
    private readonly envService: EnvService,
    @InjectQueue(STRIPE_WEBHOOK_QUEUE_NAME) private readonly queue: Queue,
  ) {
    this.stripeClient = new Stripe(this.envService.get('STRIPE_SECRET_KEY'));
    this.webhookSecret = this.envService.get('STRIPE_WEBHOOK_SECRET');
  }

  async ingest(rawBody: Buffer, signatureHeader: string) {
    let event: StripeEvent;
    try {
      event = this.stripeClient.webhooks.constructEvent(
        rawBody,
        signatureHeader,
        this.webhookSecret,
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    const accountId = typeof event.account === 'string' ? event.account : null;
    const payload = event;

    if (!isPrismaInputJsonValue(payload)) {
      throw new BadRequestException(
        'Stripe event payload is not JSON serializable',
      );
    }

    try {
      await this.prismaService.stripeWebhookEvent.create({
        data: {
          eventId: event.id,
          type: event.type,
          accountId,
          payload,
          status: STRIPE_WEBHOOK_STATUS.PENDING,
        },
      });
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT_FAILED
      ) {
        return;
      }

      throw error;
    }

    await this.queue.add(
      STRIPE_WEBHOOK_JOB_NAME,
      {
        eventId: event.id,
      },
      {
        attempts: STRIPE_WEBHOOK_ATTEMPTS,
        backoff: {
          type: 'exponential',
          delay: STRIPE_WEBHOOK_BACKOFF_DELAY,
        },
        jobId: event.id,
      },
    );
  }
}
