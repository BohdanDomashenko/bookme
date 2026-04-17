import { Injectable } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import { EnvService } from '../env/env.service';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly envService: EnvService) {
    const adapter = new PrismaPg({
      connectionString: envService.get('DATABASE_URL'),
    });

    super({ adapter });
  }
}
