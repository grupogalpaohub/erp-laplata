import dotenv from 'dotenv';

/**
 * Carrega .env.local no servidor (Node.js) apenas
 */
if (typeof window === 'undefined') {
  // Apenas no servidor
  const path = require('path');
  const fs = require('fs');
  
  const ENV_PATH = path.join(process.cwd(), '.env.local');
  if (fs.existsSync(ENV_PATH)) {
    dotenv.config({ path: ENV_PATH });
  } else {
    // Tenta .env como fallback
    const ENV_FALLBACK = path.join(process.cwd(), '.env');
    if (fs.existsSync(ENV_FALLBACK)) {
      dotenv.config({ path: ENV_FALLBACK });
    }
  }
}

// Agora lê as variáveis
const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
] as const;

const missing = REQUIRED.filter((k) => !process.env[k]);
if (missing.length) {
  // Log curto e objetivo (sem travar dev)
  console.warn('ENV WARN:', 'faltando ->', missing.join(', '), '| cwd =', process.cwd(), '| envPath =', ENV_PATH);
}

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? '',
  VERCEL_ENV: process.env.VERCEL_ENV ?? 'local',
} as const;