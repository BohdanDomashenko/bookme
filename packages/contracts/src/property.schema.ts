import z from 'zod';

export const propertyFilterSchema = z.object({
  country_code: z.string().optional(),
  city: z.string().optional(),
  price_range: z.tuple([z.number(), z.number()]).optional(),
  date_range: z.tuple([z.date(), z.date()]).optional(),
});

export type PropertyFilterSchema = z.infer<typeof propertyFilterSchema>;
