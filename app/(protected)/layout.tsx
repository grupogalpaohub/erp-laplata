import { requireSession } from '@/lib/auth/requireSession'

// Forçar SSR em todas as páginas protegidas
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'default-no-store'
export const runtime = 'nodejs'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Em desenvolvimento, não fazer verificação de auth
  // Google OAuth só funciona em produção no Vercel
  if (process.env.NODE_ENV !== 'production') {
    return <>{children}</>
  }
  
  await requireSession()
  return <>{children}</>
}

