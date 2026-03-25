import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number(),
  total: z.number(),
  pages: z.number(),
});

export const paginationQuerySchema = z.object({
  page: z.number(),
  limit: z.number().max(100).optional().default(10),
});

export const paginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: paginationSchema,
  });

export type Pagination = z.infer<typeof paginationSchema>;
export type Paginated<T extends z.ZodTypeAny> = z.infer<
  ReturnType<typeof paginatedSchema<T>>
>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
