import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUserId } from '../auth/current-user-id.decorator';
import { CreatePropertyBookingDto } from './dto/booking.dto';
import { PropertyBookingService } from './property-booking.service';

@ApiTags('Property Bookings')
@Controller('property-bookings')
export class PropertyBookingController {
  constructor(
    private readonly propertyBookingService: PropertyBookingService,
  ) {}

  @ApiOperation({
    summary: 'Create property booking',
    description:
      'Creates a booking for a property for the authenticated user.',
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({ type: CreatePropertyBookingDto })
  @UseGuards(AuthGuard)
  @Post()
  async create(
    @CurrentUserId() userId: string,
    @Body() body: CreatePropertyBookingDto,
  ) {
    return this.propertyBookingService.create(userId, body);
  }
}
