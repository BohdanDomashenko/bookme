import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropertiesFilterDto } from './dto/properties.dto';
import {
  PropertyBookingPaymentStatus,
  PropertyBookingStatus,
  PropertyStatus,
} from 'generated/prisma/enums';
import {
  formatPrismaPagination,
  getPaginated,
  getPaginationQuery,
} from 'src/common/utils/pagination.utils';

@Injectable()
export class PropertiesService {
  constructor(private readonly prismaService: PrismaService) {}

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
            paymentStatus: PropertyBookingPaymentStatus.PAID,
            checkIn: { gt: startDate },
            checkOut: { lt: endDate },
          },
        },
      }),
    };

    const [propetries, total] = await Promise.all([
      this.prismaService.property.findMany({
        where,
        ...formatPrismaPagination(pagination.page, pagination.limit),
      }),
      this.prismaService.property.count({ where }),
    ]);

    return getPaginated(propetries, pagination.limit, total);
  }
}
