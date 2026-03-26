import type { Country } from '@packages/contracts';
import { api } from './api';

export async function fetchCountries(): Promise<Country[]> {
  const { data } = await api.get('/countries/all');
  return data;
}
