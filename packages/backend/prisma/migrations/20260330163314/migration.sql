-- CreateIndex
CREATE INDEX "property_bookings_status_expires_at_idx" ON "property_bookings"("status", "expires_at");
