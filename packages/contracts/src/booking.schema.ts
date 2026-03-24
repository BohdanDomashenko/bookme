import z from 'zod';

const bookingStatusEnumSchema = z.enum(['PENDING', 'APPROVED', 'REJECTED']);
const bookingPaymentStatusEnumSchema = z.enum(['PENDING', 'PAID', 'CANCELLED']);

export const createBookingSchema = z.object({
  property_id: z.string(),
  check_in: z.date(),
  check_out: z.date(),
  guests_count: z.number(),
  status: bookingStatusEnumSchema,
  payment_status: bookingPaymentStatusEnumSchema,
});

export type CreateBookingSchema = z.infer<typeof createBookingSchema>;
