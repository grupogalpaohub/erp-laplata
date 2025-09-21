const REQUIRED = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY','NEXT_PUBLIC_SITE_URL'] as const;
const missing = REQUIRED.filter(k => !process.env[k]);
if (missing.length) {
  console.warn('WARN: Missing ENVs =>', missing.join(', '));
}
export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || '',
  VERCEL_ENV: process.env.VERCEL_ENV || 'local',
} as const;