import { headers } from 'next/headers';

/**
 * Retorna a URL base do site, cobrindo:
 * - Production: usa NEXT_PUBLIC_SITE_URL (se existir)
 * - Preview: deriva do host (ex.: workspace-git-erp-dev-...vercel.app)
 * - Dev local: fallback http://localhost:3000
 */
export function getSiteURL() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL;
  if (configured) return configured;
  try {
    const h = headers();
    const host = h.get('host');
    if (host) return `https://${host}`;
  } catch {
    // headers() indisponível em alguns contextos
  }
  return 'http://localhost:3000';
}
