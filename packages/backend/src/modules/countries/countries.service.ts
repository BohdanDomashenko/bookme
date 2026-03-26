import { Injectable } from '@nestjs/common';
import type { Country } from '@packages/contracts';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CountriesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllCountries(): Promise<Country[]> {
    const countries = await this.prismaService.country.findMany();

    return countries;
  }
}
