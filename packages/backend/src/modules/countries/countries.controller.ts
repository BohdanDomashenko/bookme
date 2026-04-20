import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CountriesService } from './countries.service';
import { SECONDS_IN_DAY } from 'src/common/constants/date.constants';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @ApiOperation({
    summary: 'List all countries',
    description: 'Returns the full countries dataset. Response is cached for 24h.',
  })
  @Get('all')
  @Header('Cache-Control', `public, max-age=${SECONDS_IN_DAY}`)
  getAllCountries() {
    return this.countriesService.getAllCountries();
  }
}
