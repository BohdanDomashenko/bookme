import z from 'zod';
import type { Paginated, PaginationQuery } from '@packages/contracts';

export function getPaginated<T extends z.ZodTypeAny>(
  data: T[],
  page: number,
  limit: number,
): Paginated<T> {
  const total = data.length;
  const pages = Math.ceil(total / limit);
  const paginatedData = data.slice((page - 1) * limit, page * limit);

  return {
    data: paginatedData,
    pagination: {
      page,
      total,
      pages,
    },
  };
}

export function formatPrismaPagination(page: number, limit: number) {
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}

export function getPaginationQuery<T extends PaginationQuery>(query: T) {
  const { page, limit, ...rest } = query;

  const pagination = { page, limit } as const;

  return [pagination, rest] as const;
}
