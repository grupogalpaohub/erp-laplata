import { requireSession } from '@/lib/auth/requireSession'

// Forçar SSR em todas as páginas protegidas
export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'default-no-store'
export const runtime = 'nodejs'

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireSession()
  return <>{children}</>
}
