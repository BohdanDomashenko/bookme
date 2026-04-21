import type { RawBodyRequest } from '@nestjs/common';
import {
  BadRequestException,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
} from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import type { Request } from 'express';
import { StripeWebhookService } from './stripe-webhook.service';

@ApiExcludeController()
@SkipThrottle()
@Controller('webhooks/stripe')
export class StripeWebhookController {
  constructor(private readonly stripeWebhookService: StripeWebhookService) {}

  @Post()
  @HttpCode(200)
  async handle(
    @Req() request: RawBodyRequest<Request>,
    @Headers('stripe-signature') signatureHeader?: string,
  ) {
    if (!request.rawBody || !signatureHeader) {
      throw new BadRequestException('Missing Stripe signature or raw body');
    }

    await this.stripeWebhookService.ingest(request.rawBody, signatureHeader);

    return {
      received: true,
    };
  }
}
