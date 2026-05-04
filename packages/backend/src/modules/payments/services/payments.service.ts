import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookingPaymentSchema } from '@packages/contracts';
import { Payment } from 'generated/prisma/client';
import { PaymentResourceType } from 'generated/prisma/enums';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import {
  PAYMENT_PROVIDERS,
  PAYMENT_RESOURCE_TYPE,
} from '../payments.constants';
import { PaymentProviderFactory } from './payment-provider.factory';

const PAYMENT_PROVIDER = PAYMENT_PROVIDERS.STRIPE;
const CURRENCY = 'USD';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly paymentProviderFactory: PaymentProviderFactory,
    private readonly prismaService: PrismaService,
  ) {}

  async createPayment(input: {
    resourceType: PaymentResourceType;
    resourceId: string;
    amount: number;
    currency: string;
  }) {
    const property = await this.prismaService.property.findUnique({
      where: {
        id: input.resourceId,
      },
      select: {
        id: true,
        price: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Booking not found');
    }

    const resourceType = PAYMENT_RESOURCE_TYPE.PROPERTY_BOOKING;
    const amount = property.price;

    let payment: Payment;

    try {
      payment = await this.prismaService.payment.create({
        data: {
          provider: PAYMENT_PROVIDER,
          resourceType,
          resourceId: property.id,
          amount,
          currency: CURRENCY,
        },
      });
    } catch (error) {
      throw new BadRequestException('Failed to create payment');
    }

    try {
      payment = await paymentProvider.createPayment({
        amount,
        currency: CURRENCY,
        resourceType,
        resourceId: property.id,
      });
    } catch (error) {
      throw new BadRequestException('Failed to create payment');
    }

    await this.prismaService.payment.create({
      data: {
        provider: input.provider,
        providerPaymentId: payment.externalPaymentId,
        resourceType: PAYMENT_RESOURCE_TYPE.PROPERTY_BOOKING,
        resourceId: property.id,
        amount: property.price,
      },
    });

    return payment;
  }
}
