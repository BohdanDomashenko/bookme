import { propertyFilterSchema } from '@packages/contracts';
import { createZodDto } from 'nestjs-zod';

export class PropertiesFilterDto extends createZodDto(propertyFilterSchema) {}
