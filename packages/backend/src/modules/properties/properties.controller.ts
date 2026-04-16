import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { PropertiesFilterDto } from './dto/properties.dto';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Get()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  async getMany(@Query() query: PropertiesFilterDto) {
    return await this.propertiesService.findMany(query);
  }
}
