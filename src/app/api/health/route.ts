import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export const runtime = 'nodejs';

type Check = { ok: boolean; latencyMs?: number; error?: string; optional?: boolean };

export async function GET(): Promise<Response> {
  const start = Date.now();
  const checks: Record<string, Check> = {};

  try {
    const admin = createAdminClient();
    const t0 = Date.now();
    const { error } = await admin.from('organizations').select('id').limit(1);
    checks.database = { ok: !error, latencyMs: Date.now() - t0, error: error ? 'DB query failed' : undefined };
  } catch (e) {
    checks.database = { ok: false, error: e instanceof Error ? e.message : 'Unknown database error' };
  }

  const requiredEnvs = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const missingEnvs = requiredEnvs.filter((key) => !process.env[key]);
  checks.environment = {
    ok: missingEnvs.length === 0,
    error: missingEnvs.length ? `Missing required env: ${missingEnvs.join(', ')}` : undefined,
  };

  checks.ai = {
    ok: Boolean(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY),
    optional: true,
    error: !(process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY) ? 'AI integration disabled: API key not set' : undefined,
  };

  checks.payment = {
    ok: Boolean(process.env.OMISE_SECRET_KEY),
    optional: true,
    error: !process.env.OMISE_SECRET_KEY ? 'Payment integration disabled: OMISE_SECRET_KEY not set' : undefined,
  };

  const coreChecks = Object.values(checks).filter((check) => !check.optional);
  const coreOk = coreChecks.every((check) => check.ok);
  const totalMs = Date.now() - start;

  return NextResponse.json(
    {
      status: coreOk ? 'ok' : 'degraded',
      version: process.env.npm_package_version || '0.1.0',
      timestamp: new Date().toISOString(),
      totalMs,
      checks,
    },
    {
      status: coreOk ? 200 : 503,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
