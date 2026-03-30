import { BadRequestException, Injectable } from '@nestjs/common';
import {
  PropertyBookingPaymentStatus,
  PropertyBookingStatus,
  PropertyStatus,
} from 'generated/prisma/enums';
import type { PropertyGetPayload } from 'generated/prisma/models';
import {
  formatPrismaPagination,
  getPaginated,
  getPaginationQuery,
} from 'src/common/utils/pagination.utils';
import { PrismaService } from '../prisma/prisma.service';
import type { PropertiesFilterDto } from './dto/properties.dto';

@Injectable()
export class PropertiesService {
  constructor(private readonly prismaService: PrismaService) {}

  checkPropertyAvailability<
    T extends PropertyGetPayload<{
      include: { bookings: true };
    }>,
  >(property: T, checkIn: Date, checkOut: Date): boolean {
    const hasOverlap = property.bookings.some(
      (booking) => booking.checkIn < checkOut && booking.checkOut > checkIn,
    );

    if (
      property.status !== PropertyStatus.ACTIVE ||
      property.deletedAt ||
      hasOverlap
    ) {
      return false;
    }

    return true;
  }

  async findMany(dto: PropertiesFilterDto) {
    const [pagination, query] = getPaginationQuery(dto);

    const {
      city,
      country_code: countryCode,
      price_range: priceRange = [],
      date_range: dateRange = [],
    } = query;

    const [priceMin, priceMax] = priceRange;
    const [startDate, endDate] = dateRange;

    const where = {
      status: PropertyStatus.ACTIVE,
      ...(city && { city }),
      ...(countryCode && { countryCode: countryCode }),
      ...(priceRange && {
        price: {
          gte: priceMin,
          lte: priceMax,
        },
      }),
      ...(dateRange && {
        bookings: {
          none: {
            status: { not: PropertyBookingStatus.REJECTED },
            AND: [
              { checkIn: { lt: endDate } },
              { checkOut: { gt: startDate } },
            ],
          },
        },
      }),
    };

    const [propetries, total] = await Promise.all([
      this.prismaService.property.findMany({
        where,
        ...formatPrismaPagination(pagination.page, pagination.limit),
        include: {
          bookings: true,
        },
      }),
      this.prismaService.property.count({ where }),
    ]);

    return getPaginated({
      data: propetries,
      page: pagination.page,
      total,
      limit: pagination.limit,
    });
  }
}
