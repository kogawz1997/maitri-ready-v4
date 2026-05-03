# Vercel Build Fixes v6

## Fixed

- Supabase browser client no longer crashes during static prerender when Vercel env is missing.
- Middleware no longer crashes when Supabase public env is not configured yet.
- Added build-safe Supabase env fallbacks so `next build` can complete.
- Forced app rendering to dynamic to reduce static prerender crashes for auth/dashboard pages.

## Required for real runtime

The build can now pass without these, but the app still needs real Supabase values to login and use data:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
