import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { PropertiesModule } from '../properties/properties.module';
import { PropertyBookingController } from './property-booking.controller';
import { PropertyBookingService } from './property-booking.service';

@Module({
  imports: [AuthModule, PrismaModule, PropertiesModule],
  providers: [PropertyBookingService],
  controllers: [PropertyBookingController],
})
export class PropertyBookingModule {}
