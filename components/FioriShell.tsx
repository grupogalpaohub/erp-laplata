'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function FioriShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  // Se é a página de login, mostrar apenas o conteúdo
  if (pathname === '/login') {
    return <div className="min-h-screen">{children}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="nav-fiori sticky top-0 z-30">
        <div className="container-fiori h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">ERP LaPlata</span>
            </div>
            <nav className="hidden md:flex items-center gap-1">
              {[
                ['/', 'Home'],
                ['/mm', 'Materiais'],
                ['/sd', 'Vendas'],
                ['/wh', 'Estoque'],
                ['/co', 'Controle'],
                ['/crm', 'CRM'],
                ['/fi', 'Financeiro'],
                ['/analytics', 'Analytics'],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  prefetch={false}
                  className={`nav-fiori-item ${pathname === href ? 'active' : ''}`}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <form action="/api/logout" method="POST">
              <button className="btn-fiori-outline">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="container-fiori py-8">{children}</main>
    </div>
  )
}
