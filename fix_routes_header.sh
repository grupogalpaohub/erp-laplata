#!/usr/bin/env bash
set -euo pipefail

echo "==> Garantir rotas no diretório correto"
mkdir -p frontend/app/mm/{vendors,purchases,receiving} frontend/app/wh/inventory

# Se o Cursor criou as páginas no src/app, mova para app/
[ -f frontend/src/app/mm/vendors/page.tsx ]   && mv -f frontend/src/app/mm/vendors/page.tsx   frontend/app/mm/vendors/page.tsx   || true
[ -f frontend/src/app/mm/purchases/page.tsx ] && mv -f frontend/src/app/mm/purchases/page.tsx frontend/app/mm/purchases/page.tsx || true
[ -f frontend/src/app/mm/receiving/page.tsx ] && mv -f frontend/src/app/mm/receiving/page.tsx frontend/app/mm/receiving/page.tsx || true
[ -f frontend/src/app/wh/inventory/page.tsx ] && mv -f frontend/src/app/wh/inventory/page.tsx frontend/app/wh/inventory/page.tsx || true

echo "==> Garantir DataTable em src/components (importado por caminho @/src/...)"
mkdir -p frontend/src/components
# se ainda não existir, crie um DataTable simples
if ! grep -q "export function DataTable" frontend/src/components/DataTable.tsx 2>/dev/null; then
cat > frontend/src/components/DataTable.tsx <<'TSX'
type Col<T> = { key: keyof T; header: string; width?: string }
export function DataTable<T extends Record<string, any>>({
  columns, rows, emptyText = 'Nenhum registro encontrado.'
}: { columns: Col<T>[]; rows: T[]; emptyText?: string }) {
  if (!rows || rows.length === 0) return <p style={{ padding: 8, color: '#666' }}>{emptyText}</p>;
  return (
    <div style={{ overflowX: 'auto' }}>
      <table cellPadding={6} style={{ borderCollapse:'collapse', width:'100%', minWidth:720 }}>
        <thead><tr>{columns.map((c,i)=><th key={i} style={{ textAlign:'left', borderBottom:'1px solid #eee', whiteSpace:'nowrap', width:c.width }}>{c.header}</th>)}</tr></thead>
        <tbody>{rows.map((r,i)=><tr key={i} style={{ borderBottom:'1px solid #f2f2f2' }}>{columns.map((c,j)=><td key={j} style={{ whiteSpace:'nowrap' }}>{String(r[c.key] ?? '')}</td>)}</tr>)}</tbody>
      </table>
    </div>
  )
}
TSX
fi

echo "==> Atualizar Header com links diretos para os módulos MM/WH"
cat > frontend/src/components/Header.tsx <<'TSX'
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
TSX

echo "==> Rebuild"
cd frontend
npm run build