import z from "zod";
import { dateRangeSchema } from "./date.schema";

export const createBookingPaymentSchema = z.object({
  property_id: z.string(),
  date_range: dateRangeSchema,
  guests_count: z.number(),
});

export type CreateBookingPaymentSchema = z.infer<typeof createBookingPaymentSchema>;
