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

// Detectar ambiente e definir SITE_URL automaticamente
function getSiteUrl() {
  // Se NEXT_PUBLIC_SITE_URL estiver definido, usar
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Detectar ambiente baseado no VERCEL_URL
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) {
    // Preview environment
    if (vercelUrl.includes('workspace-git-erp-git')) {
      return 'https://workspace-git-erp-git-grupogalpaohubs-projects.vercel.app';
    }
    // Production environment
    if (vercelUrl.includes('workspace-mu-livid')) {
      return 'https://workspace-mu-livid.vercel.app';
    }
    // Fallback para Vercel URL
    return `https://${vercelUrl}`;
  }
  
  // Fallback para desenvolvimento local
  return 'http://localhost:3000';
}

export const ENV = {
  SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL!,
  SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  SITE_URL: getSiteUrl(),
  VERCEL_ENV: process.env.VERCEL_ENV ?? '',
} as const;

// Debug: log do ambiente detectado
if (typeof window === 'undefined') {
  console.log('[ENV] Ambiente detectado:', {
    VERCEL_ENV: ENV.VERCEL_ENV,
    SITE_URL: ENV.SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  });
}