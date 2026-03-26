import { Badge, Card, Group, Image, Text } from '@mantine/core';
import type { PropertySchema } from '@packages/contracts';

export interface PropertyItemProps {
  property: PropertySchema;
}

export function PropertyItem({ property }: PropertyItemProps) {
  return (
    <Card padding='lg' radius='md' withBorder>
      <Card.Section>
        <Image src={property.main_image} height={200} alt={property.title} />
      </Card.Section>

      <Group justify='space-between' mt='md'>
        <Text fz='lg' fw={500}>
          {property.title}
        </Text>
        <Badge variant='light'>{property.status}</Badge>
      </Group>

      <Text c='dimmed' size='sm' mt='xs'>
        {property.description}
      </Text>

      <Group justify='space-between' mt='md'>
        <Text fz='lg' fw={700} c='blue'>
          ${property.price.toLocaleString()}
        </Text>
        <Text size='sm' c='dimmed'>
          {property.city}, {property.country_code}
        </Text>
      </Group>

      <Text size='xs' c='gray' mt='xs'>
        {property.address}
      </Text>
    </Card>
  );
}
