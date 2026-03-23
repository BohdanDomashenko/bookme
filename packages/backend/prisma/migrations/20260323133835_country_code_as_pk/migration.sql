/*
  Warnings:

  - The primary key for the `Country` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Country` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `Country` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to drop the column `countryId` on the `Property` table. All the data in the column will be lost.
  - You are about to drop the column `countryId` on the `User` table. All the data in the column will be lost.
  - Added the required column `code` to the `Country` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_code` to the `Property` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country_code` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Property" DROP CONSTRAINT "Property_countryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_countryId_fkey";

-- AlterTable
ALTER TABLE "Country" DROP CONSTRAINT "Country_pkey",
DROP COLUMN "id",
ADD COLUMN     "code" VARCHAR(2) NOT NULL,
ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ADD CONSTRAINT "Country_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "Property" DROP COLUMN "countryId",
ADD COLUMN     "country_code" VARCHAR(2) NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "countryId",
ADD COLUMN     "country_code" VARCHAR(2) NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Property" ADD CONSTRAINT "Property_country_code_fkey" FOREIGN KEY ("country_code") REFERENCES "Country"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
