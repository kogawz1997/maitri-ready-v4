# Maitri Ready V3 build fixes

This package applies the fixes for the Vercel failures seen after V2.

## Fixed

- Excluded `scripts/**/*` and `supabase/**/*` from app TypeScript checking so seed/admin scripts do not break `next build`.
- Added `dotenv` dependency for `scripts/seed-demo.ts` so the seed script still works locally.
- Added explicit `Promise<Response>` return types to API route handlers to avoid Next.js route export validation inferring `null` as a possible route response.
- Typed rate-limit helpers as `NextResponse | null` for safer narrowing.
- Upgraded Next.js from `15.0.3` to `15.0.7`, the patched 15.0.x line for the RSC security advisories.

## Deploy command

```bash
npm install --legacy-peer-deps --no-audit --no-fund
npm run build
```

## Required Vercel env

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

Payment, AI and channel integrations are intentionally optional until their keys are set.
