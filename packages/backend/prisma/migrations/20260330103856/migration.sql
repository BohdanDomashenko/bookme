/*
  Warnings:

  - The values [CANCELLED] on the enum `PropertyBookingPaymentStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyBookingPaymentStatus_new" AS ENUM ('PENDING', 'PAID');
ALTER TABLE "property_bookings" ALTER COLUMN "payment_status" TYPE "PropertyBookingPaymentStatus_new" USING ("payment_status"::text::"PropertyBookingPaymentStatus_new");
ALTER TYPE "PropertyBookingPaymentStatus" RENAME TO "PropertyBookingPaymentStatus_old";
ALTER TYPE "PropertyBookingPaymentStatus_new" RENAME TO "PropertyBookingPaymentStatus";
DROP TYPE "public"."PropertyBookingPaymentStatus_old";
COMMIT;
