import type { PrismaClient } from '../../generated/prisma/client.js';
import data from '../data/countries.json';

export async function seedCountries(prismaClient: PrismaClient) {
  console.log('Seeding countries...');

  for (const country of data) {
    await prismaClient.country.upsert({
      where: { code: country.code },
      update: {},
      create: country,
    });
  }
}
