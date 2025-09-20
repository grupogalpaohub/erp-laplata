'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function FioriShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  // Se não está autenticado e não é a página de login, redirecionar
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      window.location.href = '/login'
    }
  }, [isAuthenticated, isLoading, pathname])

  // Se está carregando, mostrar loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  // Se não está autenticado, mostrar apenas o conteúdo (página de login)
  if (!isAuthenticated) {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 bg-[#062238] border-b border-fiori-border">
        <div className="mx-auto max-w-7xl px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-lg font-semibold">ERP LaPlata</span>
            <nav className="hidden md:flex items-center gap-4 text-fiori-muted">
              {[
                ['/', 'Home'],
                ['/mm', 'Materiais'],
                ['/sd', 'Vendas'],
                ['/wh', 'Estoque'],
                ['/co', 'Controle'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className={pathname === href ? 'text-white' : 'hover:text-white'}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <form action="/api/logout" method="POST">
            <button className="text-sm px-3 py-1 rounded border border-fiori-border hover:bg-fiori-surface">
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  )
}
