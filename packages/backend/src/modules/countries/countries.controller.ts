import { Controller, Get, Header } from '@nestjs/common';
import { CountriesService } from './countries.service';
import { SECONDS_IN_DAY } from 'src/common/constants/date.constants';

@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Get('all')
  @Header('Cache-Control', `public, max-age=${SECONDS_IN_DAY}`)
  getAllCountries() {
    return this.countriesService.getAllCountries();
  }
}
