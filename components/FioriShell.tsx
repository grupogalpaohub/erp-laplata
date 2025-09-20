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
