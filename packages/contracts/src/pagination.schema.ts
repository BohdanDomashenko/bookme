import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.number(),
  total: z.number(),
  pages: z.number(),
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
});

export const paginatedSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: paginationSchema,
  });

export type Pagination = z.infer<typeof paginationSchema>;
export type Paginated<T> = {
  data: T[];
  pagination: Pagination;
};
export type PaginationQuery<T = unknown> = z.infer<
  typeof paginationQuerySchema
> &
  T;
export type PaginationQueryPartial<T = unknown> = Partial<
  z.infer<typeof paginationQuerySchema>
> &
  T;
