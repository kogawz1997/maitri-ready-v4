-- ============================================
-- Production Readiness Fixes
-- Safe indexes used by seed scripts and common onboarding queries.
-- ============================================

CREATE UNIQUE INDEX IF NOT EXISTS room_types_hotel_code_unique
  ON room_types(hotel_id, code)
  WHERE code IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS guests_hotel_email_unique
  ON guests(hotel_id, email)
  WHERE email IS NOT NULL;

CREATE INDEX IF NOT EXISTS hotels_org_created_idx
  ON hotels(organization_id, created_at DESC);

CREATE INDEX IF NOT EXISTS user_profiles_active_org_idx
  ON user_profiles(organization_id, active);
