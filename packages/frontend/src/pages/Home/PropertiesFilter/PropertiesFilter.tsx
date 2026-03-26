import { DateInput } from '@mantine/dates';
import { Group, NumberInput, TextInput } from '@mantine/core';
import type { PropertyFilterSchema } from '@packages/contracts';
import { CountriesSelect } from '../../../components/CountriesSelect/CountriesSelect';
import { addDays } from 'date-fns';

export interface PropertiesFilterProps {
  value: PropertyFilterSchema;
  onChange: (filters: PropertyFilterSchema) => void;
}

export function PropertiesFilter({ value, onChange }: PropertiesFilterProps) {
  const {
    country_code: countryCode,
    city,
    price_range: priceRange,
    date_range: dateRange,
  } = value;

  const handleCountryChange = (value: string | null) => {
    onChange({
      ...{ country_code: value || undefined },
      city,
      price_range: priceRange,
      date_range: dateRange,
    });
  };

  const handleCityChange = (value: string) => {
    onChange({
      country_code: countryCode,
      city: value || undefined,
      price_range: priceRange,
      date_range: dateRange,
    });
  };

  const handlePriceRangeChange = (value: number, field: 'min' | 'max') => {
    const [currentMin, currentMax] = priceRange || [0, 0];

    const newRange: [number, number] = [
      field === 'min' ? value : currentMin,
      field === 'max' ? value : currentMax,
    ];
    onChange({
      country_code: countryCode,
      city,
      price_range: newRange,
      date_range: dateRange,
    });
  };

  const handleDateRangeChange = (
    value: Date | null,
    field: 'start' | 'end',
  ) => {
    const now = new Date();
    const [currentStart, currentEnd] = dateRange || [new Date(), new Date()];

    const newRange: [Date, Date] = [
      field === 'start' ? value || addDays(now, 1) : currentStart,
      field === 'end' ? value || addDays(now, 5) : currentEnd,
    ];

    onChange({
      country_code: countryCode,
      city,
      price_range: priceRange,
      date_range: newRange,
    });
  };

  return (
    <Group wrap='wrap' mb='md'>
      <CountriesSelect value={countryCode} onChange={handleCountryChange} />

      <TextInput
        label='City'
        placeholder='Enter city'
        value={city}
        onChange={(el) => handleCityChange(el.target.value)}
      />

      <NumberInput
        label='Min Price'
        placeholder='0'
        value={priceRange?.[0] || ''}
        onChange={(value) => handlePriceRangeChange(Number(value), 'min')}
        min={0}
      />

      <NumberInput
        label='Max Price'
        placeholder='10000'
        value={priceRange?.[1] || ''}
        onChange={(value) => handlePriceRangeChange(Number(value), 'max')}
        min={0}
      />

      <DateInput
        label='Check-in'
        placeholder='Select date'
        value={dateRange?.[0] || null}
        onChange={(value) =>
          handleDateRangeChange(new Date(value || ''), 'start')
        }
        minDate={new Date()}
        clearable
      />

      <DateInput
        label='Check-out'
        placeholder='Select date'
        value={dateRange?.[1] || null}
        onChange={(value) =>
          handleDateRangeChange(new Date(value || ''), 'end')
        }
        minDate={dateRange?.[0] || new Date()}
        clearable
      />
    </Group>
  );
}
