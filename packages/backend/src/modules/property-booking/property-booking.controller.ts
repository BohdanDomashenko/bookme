import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { CreatePropertyBookingDto } from './dto/booking.dto';
import { PropertyBookingService } from './property-booking.service';

@Controller('property-bookings')
export class PropertyBookingController {
  constructor(
    private readonly propertyBookingService: PropertyBookingService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() body: CreatePropertyBookingDto,
  ) {
    return this.propertyBookingService.create(userId, body);
  }
}
