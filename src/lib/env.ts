// ===== VALIDAÇÃO CENTRALIZADA DE VARIÁVEIS DE AMBIENTE =====

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
] as const;

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  throw new Error(
    `Missing env(s): ${missing.join(', ')}. Configure no Vercel (Preview).`
  );
}

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://workspace-git-erp-git-grupogalpaohubs-projects.vercel.app',
  VERCEL_ENV: process.env.VERCEL_ENV ?? '',
} as const;