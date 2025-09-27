import Link from 'next/link'
import { getUserServer } from '@/lib/auth/getUserServer'
import { ENV } from '@/lib/env'

export default async function FioriShell({ children }: { children: React.ReactNode }) {
  const user = await getUserServer();
  const isAuthenticated = !!user;

  return (
    <div className="min-h-screen bg-fiori-primary">
      <header className="nav-fiori sticky top-0 z-30">
        <div className="container-fiori h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="text-xl font-semibold text-fiori-primary">ERP LaPlata</span>
              {ENV.AUTH_DISABLED && (
                <span className="ml-2 px-2 py-0.5 text-xs rounded bg-yellow-500/20 text-yellow-300 border border-yellow-400/40">
                  DEV (auth off)
                </span>
              )}
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
                  className="nav-fiori-item"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            {ENV.AUTH_DISABLED ? (
              <div className="text-sm text-gray-300">
                Modo Desenvolvimento
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">{user?.email}</span>
                <form action="/api/logout" method="POST">
                  <button className="btn-fiori-outline">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sair
                  </button>
                </form>
              </div>
            ) : (
              <Link href="/login" className="btn-fiori-primary">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>
      <main className="container-fiori py-8">{children}</main>
    </div>
  )
}

