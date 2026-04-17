-- DropIndex
DROP INDEX "property_bookings_status_expires_at_idx";

-- CreateIndex
CREATE INDEX "property_bookings_status_idx" ON "property_bookings"("status");

-- CreateIndex
CREATE INDEX "property_bookings_check_in_idx" ON "property_bookings"("check_in");

-- CreateIndex
CREATE INDEX "property_bookings_check_out_idx" ON "property_bookings"("check_out");
