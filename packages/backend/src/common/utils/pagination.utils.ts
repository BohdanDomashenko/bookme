import type { Paginated, PaginationQuery } from '@packages/contracts';

export function getPaginated<T>(payload: {
  data: T[];
  page: number;
  total: number;
  limit: number;
}): Paginated<T> {
  const { data, page, total, limit } = payload;

  const pages = Math.ceil(total / limit);

  return {
    data,
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
