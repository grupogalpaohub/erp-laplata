function stripTrailingSlash(u: string) { return u.replace(/\/+$/, '') }
export function siteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_VERCEL_URL ||
    ''
  if (!raw) return 'http://localhost:3000'
  const base = raw.startsWith('http') ? raw : `https://${raw}`
  return stripTrailingSlash(base)
}
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY