import { requireSession } from '@/lib/auth/requireSession'

// Forçar SSR em todas as páginas protegidas
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'default-no-store'
export const runtime = 'nodejs'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  // Em desenvolvimento, não quebrar se não houver sessão
  // O FioriShell vai lidar com a verificação de auth
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>
  }
  
  await requireSession()
  return <>{children}</>
}
