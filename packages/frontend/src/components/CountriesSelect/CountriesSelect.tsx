import { useQuery } from '@tanstack/react-query';
import { Select, type SelectProps } from '@mantine/core';
import type { Country } from '@packages/contracts';
import { fetchCountries } from '../../common/api/countries.api';
import { API_QUERY_KEYS } from '../../common/constants/api.constants';

export interface CountriesSelectProps extends SelectProps {
  value?: string | null;
  onChange: (value: string | null) => void;
}

export function CountriesSelect({
  value,
  onChange,
  ...rest
}: CountriesSelectProps) {
  const { data } = useQuery({
    queryKey: API_QUERY_KEYS.COUNTRIES,
    queryFn: fetchCountries,
  });

  const options = data?.map((country: Country) => ({
    value: country.code,
    label: country.name,
  }));

  return (
    <Select
      label='Country'
      placeholder='Select country'
      data={options || []}
      value={value}
      onChange={onChange}
      clearable
      searchable
      {...rest}
    />
  );
}
