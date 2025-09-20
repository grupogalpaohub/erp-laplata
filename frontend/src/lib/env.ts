/**
 * Centraliza leitura de variáveis públicas e privadas de URL,
 * evitando uso direto de process.env espalhado e hardcodes.
 */
function stripTrailingSlash(u: string) {
  return u.replace(/\/+$/, '')
}

/** URL pública do app (usada em redirects/OAuth). */
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || ''
  if (raw) {
    const base = raw.startsWith('http') ? raw : `https://${raw}`
    return stripTrailingSlash(base)
  }
  // Fallback seguro para dev
  return 'http://localhost:3000'
}

/** Supabase URL pública (nunca use no middleware). */
export function supabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return stripTrailingSlash(url)
}
