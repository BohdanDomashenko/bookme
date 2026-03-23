import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from 'generated/prisma/client';
import assert from 'node:assert';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor(private readonly configService: ConfigService) {
    const DATABASE_URL = configService.get('DATABASE_URL');

    assert(DATABASE_URL, 'DATABASE_URL environment variable is missing');

    const adapter = new PrismaPg({
      connectionString: configService.get('DATABASE_URL'),
    });

    super({ adapter });
  }
}
