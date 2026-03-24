import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PropertiesFilterDto } from './dto/properties.dto';
import {
  PropertyBookingPaymentStatus,
  PropertyBookingStatus,
  PropertyStatus,
} from 'generated/prisma/enums';

@Injectable()
export class PropertiesService {
  constructor(private readonly prismaService: PrismaService) {}

  async findMany(findAllDto: PropertiesFilterDto) {
    const {
      city,
      country_code: countryCode,
      price_range: priceRange = [],
      date_range: dateRange = [],
    } = findAllDto;

    const [priceMin, priceMax] = priceRange;
    const [startDate, endDate] = dateRange;

    const propetries = await this.prismaService.property.findMany({
      where: {
        status: PropertyStatus.ACTIVE,
        ...(city && { city }),
        ...(countryCode && { country: countryCode }),
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
      },
    });

    return propetries;
  }
}
