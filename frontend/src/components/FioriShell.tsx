import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabase/server'

export default async function FioriShell({ children }: { children: React.ReactNode }) {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <div style={{ display:'grid', gridTemplateColumns:'220px 1fr', minHeight:'100vh' }}>
      <aside style={{ borderRight:'1px solid #eee', padding:'1rem', position:'sticky', top:0, height:'100vh' }}>
        <h3 style={{ margin:0, fontWeight:700 }}>ERP LaPlata</h3>
        <nav style={{ display:'grid', gap:8, marginTop:12 }}>
          <strong>Controle</strong>
          <Link href="/">Home</Link>

          <strong style={{ marginTop:16 }}>Materiais (MM)</strong>
          <Link href="/mm/catalog">Catálogo</Link>
          <Link href="/mm/vendors">Fornecedores</Link>

          <strong style={{ marginTop:16 }}>Estoque (WH)</strong>
          <Link href="/wh/inventory">Inventário</Link>

          <strong style={{ marginTop:16 }}>Vendas (SD)</strong>
          <Link href="/sd">Visão de Vendas</Link>
          <Link href="/sd/orders">Pedidos</Link>

          <strong style={{ marginTop:16, opacity:.6 }}>Em breve</strong>
          <span style={{ opacity:.6 }}>CRM</span>
          <span style={{ opacity:.6 }}>Financeiro</span>
          <span style={{ opacity:.6 }}>Analytics</span>
        </nav>
      </aside>

      <div style={{ display:'flex', flexDirection:'column' }}>
        <header style={{ borderBottom:'1px solid #eee', padding:'0.75rem 1rem', display:'flex', alignItems:'center', gap:16 }}>
          <nav style={{ display:'flex', gap:16 }}>
            <Link href="/">Controle</Link>
            <Link href="/mm/catalog">Materiais</Link>
            <Link href="/wh/inventory">Estoque</Link>
            <Link href="/sd/orders">Vendas</Link>
          </nav>
          <span style={{ flex:1 }} />
          {user ? (
            <form action="/api/logout" method="post"><button type="submit">Sair</button></form>
          ) : (
            <Link href="/login">Login</Link>
          )}
        </header>
        <main style={{ padding:'1rem 1.25rem' }}>
          {children}
        </main>
      </div>
    </div>
  )
}
