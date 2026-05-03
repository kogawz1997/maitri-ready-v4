# Maitri production patch notes

Applied by ChatGPT on 2026-05-03.

## What changed

- Added `/auth/onboarding` so users who confirm email or login without a profile can finish hotel setup safely.
- Updated signup flow to handle Supabase email confirmation correctly instead of hard-failing on `/api/auth/setup-organization` 401.
- Updated login flow to route users without `user_profiles.organization_id` to onboarding.
- Hardened dashboard layout/page so missing profile does not render a broken dashboard.
- Made `/api/health` production-friendly: Supabase core env + DB are required, while AI/payment integrations are optional and do not make the whole app return 503.
- Made `scripts/check-production-env.mjs` require only core env vars and warn for optional integrations.
- Removed the Supabase CLI package from `devDependencies` because it is not needed for Vercel builds and can make npm installs slower/flakier.
- Added `.npmrc` to reduce install noise and peer-dependency failures.
- Added `vercel.json` with stable install/build commands and Hong Kong region.
- Added Node/npm engines to `package.json`.

## Required Vercel env vars

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

## Optional env vars

These unlock integrations but are not required for core PMS usage:

```env
ANTHROPIC_API_KEY=
OMISE_PUBLIC_KEY=
OMISE_SECRET_KEY=
OMISE_WEBHOOK_SECRET=
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
WHATSAPP_ACCESS_TOKEN=
```

## Deploy commands

```bash
npm install --legacy-peer-deps --no-audit --no-fund
npm run type-check
npm run build
```

## Important note

I could not generate a real `package-lock.json` in this offline sandbox because dependency resolution requires external npm registry access. Generate it on your machine or let Vercel install with the included `.npmrc`/`vercel.json`.
