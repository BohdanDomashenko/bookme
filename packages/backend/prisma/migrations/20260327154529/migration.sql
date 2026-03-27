/*
  Warnings:

  - You are about to drop the column `checkIn` on the `property_bookings` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `property_bookings` table. All the data in the column will be lost.
  - Added the required column `check_in` to the `property_bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_out` to the `property_bookings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "property_bookings" DROP COLUMN "checkIn",
DROP COLUMN "checkOut",
ADD COLUMN     "check_in" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "check_out" TIMESTAMP(3) NOT NULL;
