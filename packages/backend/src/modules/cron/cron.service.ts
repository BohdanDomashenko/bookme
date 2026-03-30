import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { PropertyBookingStatus } from 'generated/prisma/enums';
import { CRON_EXPRESSIONS } from 'src/common/constants/cront.constants';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);
  constructor(private readonly prismaService: PrismaService) {}

  @Cron(CRON_EXPRESSIONS.EVERY_MINUTE)
  async expirePendingBookings() {
    const now = new Date();

    this.logger.log(`Checking for expired pending bookings at ${now}`);

    const pendingBookings = await this.prismaService.propertyBooking.updateMany(
      {
        where: {
          status: PropertyBookingStatus.PENDING,
          expiresAt: {
            lt: now,
          },
        },
        data: {
          status: PropertyBookingStatus.REJECTED,
        },
      },
    );

    this.logger.log(`Expired ${pendingBookings.count} pending bookings`);
  }
}
