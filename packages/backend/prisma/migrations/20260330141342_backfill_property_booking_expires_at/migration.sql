UPDATE "property_bookings"
SET "expires_at" = "created_at" + INTERVAL '30 minutes'
WHERE "expires_at" IS NULL;
