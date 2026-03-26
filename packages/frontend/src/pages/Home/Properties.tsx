import { Grid, Loader, Text } from '@mantine/core';
import type { PropertyFilterSchema, PropertySchema } from '@packages/contracts';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { PropertyItem } from './PropertyItem';
import { API_QUERY_KEYS } from '../../common/constants/api.constants';
import { fetchProperties } from '../../common/api/properties.api';
import { PropertiesFilter } from './PropertiesFilter/PropertiesFilter';
import { useDebounce } from 'use-debounce';

export function Properties() {
  const [currentFilters, setCurrentFilters] = useState<PropertyFilterSchema>(
    {},
  );

  const [debouncedFilters] = useDebounce(currentFilters, 500);

  const { data, isLoading, error } = useQuery({
    queryKey: [...API_QUERY_KEYS.PROPERTIES, debouncedFilters],
    queryFn: () => fetchProperties(debouncedFilters),
  });

  const handleFilterChange = (newFilters: PropertyFilterSchema) => {
    setCurrentFilters(newFilters);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className='flex justify-center p-8'>
          <Loader />
        </div>
      );
    }

    if (error) {
      return (
        <Text c='red' ta='center'>
          Failed to load properties
        </Text>
      );
    }

    if (!data || data.data?.length === 0) {
      return (
        <Text c='dimmed' ta='center'>
          No properties found
        </Text>
      );
    }
    return (
      <Grid grow>
        {data.data.map((property: PropertySchema) => (
          <Grid.Col span={{ base: 1, md: 2, lg: 3 }} key={property.id}>
            <PropertyItem property={property} />
          </Grid.Col>
        ))}
      </Grid>
    );
  };

  return (
    <>
      <PropertiesFilter value={currentFilters} onChange={handleFilterChange} />
      {renderContent()}
    </>
  );
}
