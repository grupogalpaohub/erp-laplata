// ===== VALIDAÇÃO CENTRALIZADA DE VARIÁVEIS DE AMBIENTE =====

const REQUIRED = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL',
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
  SITE_URL: process.env.NEXT_PUBLIC_SITE_URL!, // sem barra final
  VERCEL_ENV: process.env.VERCEL_ENV ?? '',
} as const;

// Guard: em preview, garantir que estamos usando o domínio correto
if (ENV.VERCEL_ENV === 'preview') {
  const MUST = 'https://workspace-git-erp-git-grupogalpaohubs-projects.vercel.app';
  if (ENV.SITE_URL !== MUST) {
    throw new Error(
      `Preview com SITE_URL incorreto. Esperado: ${MUST} — Atual: ${ENV.SITE_URL}`
    );
  }
}