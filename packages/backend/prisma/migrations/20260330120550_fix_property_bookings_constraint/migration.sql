ALTER TABLE "property_bookings"
DROP CONSTRAINT IF EXISTS "no_overlapping_bookings";

ALTER TABLE "property_bookings"
ADD CONSTRAINT "no_overlapping_bookings"
EXCLUDE USING gist (
  property_id WITH =,
  tsrange("check_in", "check_out", '[)') WITH &&
)
WHERE ("status" NOT IN ('APPROVED'::"PropertyBookingStatus", 'REJECTED'::"PropertyBookingStatus"));
