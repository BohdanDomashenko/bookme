import { Controller, Get, Query } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesFilterDto } from './dto/properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  async getMany(@Query() query: PropertiesFilterDto) {
    return await this.propertiesService.findMany(query);
  }
}
