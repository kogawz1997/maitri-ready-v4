const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];
const optional = [
  'ANTHROPIC_API_KEY',
  'OMISE_SECRET_KEY',
  'OMISE_WEBHOOK_SECRET',
  'BOOKING_COM_WEBHOOK_TOKEN',
  'AGODA_WEBHOOK_TOKEN',
];
const missing = required.filter((key) => !process.env[key]);
if (missing.length) {
  console.error(`Missing required production env: ${missing.join(', ')}`);
  process.exit(1);
}
const missingOptional = optional.filter((key) => !process.env[key]);
if (missingOptional.length) {
  console.warn(`Optional integrations disabled until env is set: ${missingOptional.join(', ')}`);
}
console.log('Production environment has the required core configuration.');
