import dotenv from 'dotenv';

/**
 * Carrega .env.local/.env em ambientes Node (SSR e API).
 * No Edge (middleware), este arquivo NÃO deve ser importado.
 */
if (typeof process !== 'undefined' && process.env.NEXT_RUNTIME !== 'edge') {
  // Força carregamento do .env.local
  dotenv.config({ path: '.env.local' });
  
  // Se ainda não tem as variáveis, tenta .env
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    dotenv.config();
  }
}

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const;

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  // log enxuto; sem variáveis inexistentes como ENV_PATH
  console.warn('[ENV WARN] faltando:', missing.join(', '));
}

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  VERCEL_ENV: process.env.VERCEL_ENV ?? 'local',
  AUTH_DISABLED: (process.env.AUTH_DISABLED === 'true' || process.env.AUTH_DISABLED === '1'),
  SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
} as const;