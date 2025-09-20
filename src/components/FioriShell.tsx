'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Nav = ({ href, label }:{href:string;label:string})=>{
  const p = usePathname()
  const active = p===href || (href !== '/' && p.startsWith(href))
  return <Link href={href} className={`block px-3 py-2 rounded ${active?'bg-gray-200 font-semibold':'hover:bg-gray-100'}`}>{label}</Link>
}

export default function FioriShell({ children }:{ children: React.ReactNode }){
  return (
    <div className="min-h-screen flex">
      <aside className="w-64 border-r bg-gray-50">
        <div className="px-4 py-4 font-bold">ERP LaPlata</div>
        <nav className="px-2 pb-6 space-y-6">
          <div>
            <div className="px-2 text-xs text-gray-500 uppercase">Controle</div>
            <Nav href="/" label="Home" />
          </div>
          <div>
            <div className="px-2 text-xs text-gray-500 uppercase">Materiais (MM)</div>
            <Nav href="/mm/catalog" label="Catálogo" />
            <Nav href="/mm/materials" label="Materiais" />
            <Nav href="/mm/materials/new" label="Novo Material" />
            <Nav href="/mm/vendors" label="Fornecedores" />
            <Nav href="/mm/purchases" label="Pedidos de Compra" />
          </div>
          <div>
            <div className="px-2 text-xs text-gray-500 uppercase">Estoque (WH)</div>
            <Nav href="/wh/inventory" label="Inventário" />
          </div>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="h-12 border-b flex items-center justify-between px-4">
          <div className="font-medium">Fiori</div>
          <form action="/api/logout" method="post"><button className="text-sm underline">Sair</button></form>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  )
}
