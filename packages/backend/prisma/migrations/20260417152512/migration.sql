-- DropIndex
DROP INDEX "Property_price_idx";

-- DropIndex
DROP INDEX "property_bookings_check_in_idx";

-- DropIndex
DROP INDEX "property_bookings_check_out_idx";

-- DropIndex
DROP INDEX "property_bookings_status_idx";

-- CreateIndex
CREATE INDEX "Property_status_country_code_city_price_idx" ON "Property"("status", "country_code", "city", "price");

-- CreateIndex
CREATE INDEX "property_bookings_property_id_check_in_check_out_idx" ON "property_bookings"("property_id", "check_in", "check_out");
