# Vercel Build Fixes v5

This patch removes the known build blockers seen in Vercel logs:

- LINE SDK is now lazy-loaded. Missing `LINE_CHANNEL_ACCESS_TOKEN` no longer crashes `next build` during page-data collection.
- `next/font/google` was removed from `src/app/layout.tsx`, so builds no longer depend on fetching Google font files from `fonts.gstatic.com`.
- The app still keeps fallback font variables for Tailwind: display, sans, and mono.

Required env for a basic deploy:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=
```

Optional integrations can be added later:

```env
LINE_CHANNEL_ACCESS_TOKEN=
LINE_CHANNEL_SECRET=
ANTHROPIC_API_KEY=
OMISE_SECRET_KEY=
OMISE_WEBHOOK_SECRET=
```
