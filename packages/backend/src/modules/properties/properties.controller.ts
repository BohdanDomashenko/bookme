import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PropertiesFilterDto } from './dto/properties.dto';
import { PropertiesService } from './properties.service';

@ApiTags('Properties')
@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @ApiOperation({
    summary: 'Search properties',
    description: 'Returns a paginated list of properties matching filter criteria.',
  })
  @Get()
  async getMany(@Query() query: PropertiesFilterDto) {
    return await this.propertiesService.findMany(query);
  }
}
