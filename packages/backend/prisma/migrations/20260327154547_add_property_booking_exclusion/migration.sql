CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE "property_bookings" ADD CONSTRAINT "no_overlapping_bookings" 
EXCLUDE USING gist (
  property_id WITH =,
  tsrange("check_in", "check_out", '[]') WITH &&
);