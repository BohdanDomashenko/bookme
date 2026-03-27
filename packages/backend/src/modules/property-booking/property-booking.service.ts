import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import {
  PropertyBookingPaymentStatus,
  PropertyBookingStatus,
  PropertyStatus,
} from 'generated/prisma/enums';
import { PRISMA_ERROR_CODES } from 'src/common/constants/prisma.constants';
// Nest DI needs a value import for reflect-metadata param types.
// biome-ignore lint/style/useImportType: constructor token for Nest metadata
import { PrismaService } from '../prisma/prisma.service';
// biome-ignore lint/style/useImportType: constructor token for Nest metadata
import { PropertiesService } from '../properties/properties.service';
import type { CreatePropertyBookingDto } from './dto/booking.dto';

@Injectable()
export class PropertyBookingService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly propertiesService: PropertiesService,
  ) {}

  async create(userId: string, dto: CreatePropertyBookingDto) {
    const {
      property_id: propertyId,
      check_in: checkIn,
      check_out: checkOut,
      guests_count: guestsCount,
    } = dto;

    const property = await this.prismaService.property.findUnique({
      where: {
        id: propertyId,
        status: PropertyStatus.ACTIVE,
        deletedAt: null,
      },
      include: {
        bookings: true,
        country: true,
      },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    try {
      const booking = await this.prismaService.propertyBooking.create({
        data: {
          userId,
          propertyId,
          // no_overlapping_bookings constraint will be checked by the database
          checkIn,
          checkOut,
          guestsCount,
          status: PropertyBookingStatus.PENDING,
          paymentStatus: PropertyBookingPaymentStatus.PENDING,
        },
      });

      return booking;
    } catch (error) {
      const code = error?.code ?? error?.cause?.code;

      if (code === PRISMA_ERROR_CODES.EXCLUSION_CONSTRAINT_FAILED) {
        throw new BadRequestException('Property is not available');
      }

      throw error;
    }
  }
}
