import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabase/server'

export default async function Header() {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()

  return (
    <nav style={{ display:'flex', gap:16, padding:'0.75rem 1rem', borderBottom:'1px solid #eee', flexWrap:'wrap' }}>
      <Link href="/">Controle</Link>
      {/* MM */}
      <Link href="/mm/catalog">Materiais</Link>
      <Link href="/mm/vendors">Fornecedores</Link>
      <Link href="/mm/purchases">Compras</Link>
      <Link href="/mm/receiving">Recebimentos</Link>
      {/* WH */}
      <Link href="/wh/inventory">Inventário</Link>
      {/* Placeholders dos demais módulos */}
      <Link href="/sd">Vendas</Link>
      <Link href="/crm">CRM</Link>
      <Link href="/fi">Financeiro</Link>
      <Link href="/analytics">Analytics</Link>
      <span style={{ flex:1 }} />
      {user ? (
        <form action="/api/logout" method="post"><button type="submit">Sair</button></form>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  )
}
