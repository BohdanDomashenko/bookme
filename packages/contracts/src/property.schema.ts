import { addDays, startOfDay } from 'date-fns';
import z from 'zod';

export const propertySchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string(),
  description: z.string(),
  price: z.number(),
  country_code: z.string(),
  city: z.string(),
  address: z.string(),
  main_image: z.string(),
  images: z.array(z.string()),
  deletedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const propertyFilterSchema = z.object({
  country_code: z.string().optional(),
  city: z.string().optional(),
  price_range: z.array(z.coerce.number()).length(2).optional(),
  date_range: z
    .array(z.coerce.date())
    .length(2)
    .refine(([start]) => start >= startOfDay(addDays(new Date(), 1)), {
      message: 'Start date must be at least 1 day from today',
    })
    .refine(([start, end]) => end >= addDays(start, 1), {
      message: 'End date must be at least 1 day after start date',
    })
    .optional(),
});

export type PropertySchema = z.infer<typeof propertySchema>;
export type PropertyFilterSchema = z.infer<typeof propertyFilterSchema>;
