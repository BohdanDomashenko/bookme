import { Container, Title } from '@mantine/core';
import { Properties } from './Properties';

export function Home() {
  return (
    <Container size='xl' py='xl'>
      <Title order={1} mb='xl'>
        Available Properties
      </Title>
      <Properties />
    </Container>
  );
}
