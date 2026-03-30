import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { addMinutes } from 'date-fns';
import {
  PropertyBookingPaymentStatus,
  PropertyBookingStatus,
  PropertyStatus,
} from 'generated/prisma/enums';
import { PRISMA_ERROR_CODES } from 'src/common/constants/prisma.constants';
import { PROPERTY_BOOKING_EXPIRATION_MINUTES } from 'src/common/constants/property-booking.constants';
// Nest DI needs a value import for reflect-metadata param types.
// biome-ignore lint/style/useImportType: constructor token for Nest metadata
import { PrismaService } from '../prisma/prisma.service';
import type { CreatePropertyBookingDto } from './dto/booking.dto';

@Injectable()
export class PropertyBookingService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(userId: string, dto: CreatePropertyBookingDto) {
    const now = new Date();

    const {
      property_id: propertyId,
      date_range: [checkIn, checkOut],
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
          expiresAt: addMinutes(now, PROPERTY_BOOKING_EXPIRATION_MINUTES),
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
