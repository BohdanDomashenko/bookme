import { createBookingSchema } from '@packages/contracts';
import { createZodDto } from 'nestjs-zod';

export class CreatePropertyBookingDto extends createZodDto(
  createBookingSchema,
) {}
