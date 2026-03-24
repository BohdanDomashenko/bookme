import { createZodDto } from 'nestjs-zod';
import { createBookingSchema } from '@packages/contracts';

export class BookingDto extends createZodDto(createBookingSchema) {}
