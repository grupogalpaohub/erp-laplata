function stripTrailingSlash(u: string) {
  return u.replace(/\/+$/, '')
}
export function siteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_VERCEL_URL || ''
  if (raw) {
    const base = raw.startsWith('http') ? raw : `https://${raw}`
    return stripTrailingSlash(base)
  }
  return 'http://localhost:3000'
}
export function supabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!url) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  return stripTrailingSlash(url)
}