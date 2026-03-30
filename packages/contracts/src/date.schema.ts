import { addDays, startOfDay } from 'date-fns';
import z from 'zod';

export const dateRangeSchema = z
  .array(z.coerce.date())
  .length(2)
  .refine(([start]) => start >= startOfDay(addDays(new Date(), 1)), {
    message: 'Start date must be at least 1 day from today',
  })
  .refine(([start, end]) => end >= addDays(start, 1), {
    message: 'End date must be at least 1 day after start date',
  });
