/*
  Warnings:

  - Made the column `expires_at` on table `property_bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "property_bookings" ALTER COLUMN "expires_at" SET NOT NULL;
