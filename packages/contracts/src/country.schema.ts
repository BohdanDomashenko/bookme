import z from 'zod';

export const countrySchema = z.object({
  code: z.string(),
  name: z.string(),
});

export type Country = z.infer<typeof countrySchema>;
