import z from 'zod';
import { dateRangeSchema } from './date.schema';

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
  date_range: dateRangeSchema.optional(),
});

export type PropertySchema = z.infer<typeof propertySchema>;
export type PropertyFilterSchema = z.infer<typeof propertyFilterSchema>;
