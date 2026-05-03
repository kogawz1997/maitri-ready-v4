# Ready-to-deploy patch notes

## What was fixed

- Made optional integrations optional in `/api/health` so missing AI/payment keys no longer break core health.
- Added `/auth/onboarding` for users who confirmed email or logged in before an organization exists.
- Hardened signup flow so Supabase email confirmation no longer causes a hard 401 failure.
- Hardened login flow to route users without `user_profiles.organization_id` into onboarding.
- Dashboard now redirects missing profiles/workspaces to onboarding instead of silently rendering broken state.
- Added `.npmrc` and package metadata to reduce Vercel/npm peer dependency and install noise.
- Relaxed `production:verify` so deploy readiness checks do not require optional payment keys.
- Added database indexes/constraints for demo seeding and onboarding lookup stability.

## Required Vercel env

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

## Optional env

```env
ANTHROPIC_API_KEY=
OPENAI_API_KEY=
OMISE_SECRET_KEY=
OMISE_WEBHOOK_SECRET=
BOOKING_COM_WEBHOOK_TOKEN=
AGODA_WEBHOOK_TOKEN=
```

## Deploy commands

Use Node 20.x.

```bash
npm install --legacy-peer-deps --no-audit --no-fund
npm run type-check
npm run build
```

If Vercel still hangs at install, generate and commit `package-lock.json` locally with:

```bash
npm install --package-lock-only --legacy-peer-deps --no-audit --no-fund
```

Then set Vercel install command to:

```bash
npm ci --legacy-peer-deps --no-audit --no-fund
```
