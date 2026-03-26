import type {
  Paginated,
  PaginationQueryPartial,
  PropertyFilterSchema,
  PropertySchema,
} from '@packages/contracts';
import { api } from './api';

export async function fetchProperties(
  params: PaginationQueryPartial<PropertyFilterSchema> = {},
): Promise<Paginated<PropertySchema>> {
  const { data } = await api.get('/properties', { params });
  return data;
}
