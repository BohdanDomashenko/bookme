import { PrismaClient } from '../../generated/prisma/client.js';
import { PropertyStatus } from '../../generated/prisma/enums.js';
import data from '../data/properties.json';

export async function seedProperties(
  prismaClient: PrismaClient,
): Promise<void> {
  console.log('Seeding properties...');

  for (const property of data) {
    await prismaClient.property.create({
      data: {
        title: property.title,
        status: PropertyStatus.ACTIVE,
        description: property.description ?? undefined,
        price: property.price,
        countryCode: property.countryCode,
        city: property.city,
        address: property.address,
        mainImage: property.mainImage,
        images: property.images,
      },
    });
  }

  console.log(`Successfully seeded ${data.length} properties`);
}
