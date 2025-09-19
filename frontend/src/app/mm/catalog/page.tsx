import { supabaseServer } from '@/src/lib/supabase/server'

type Row = {
  tenant_id: string
  sku?: string | null
  mm_comercial?: string | null
  mm_mat_type?: string | null
  mm_mat_class?: string | null
  sales_price_cents?: number | null
  avg_unit_cost_cents?: number | null
}

export const revalidate = 0

export default async function CatalogPage() {
  const sb = supabaseServer()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Catálogo de Materiais</h2>
        <p>Faça login para ver os materiais.</p>
      </main>
    )
  }

  const { data, error } = await sb
    .from('v_material_overview' as any)
    .select('tenant_id, sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents, avg_unit_cost_cents')
    .order('sku', { ascending: true })
    .limit(300)

  if (error) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Catálogo de Materiais</h2>
        <pre style={{ color: 'crimson' }}>Erro ao carregar catálogo: {error.message}</pre>
      </main>
    )
  }

  if (!data || data.length === 0) {
    return (
      <main style={{ padding: '2rem' }}>
        <h2>Catálogo de Materiais</h2>
        <p>Nenhum material encontrado.</p>
      </main>
    )
  }

  return (
    <main style={{ padding: '2rem' }}>
      <h2>Catálogo de Materiais</h2>
      <table cellPadding={6} style={{ borderCollapse: 'collapse', marginTop: 12 }}>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Comercial</th>
            <th>Tipo</th>
            <th>Classe</th>
            <th>Preço (centavos)</th>
            <th>Custo Médio (centavos)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: Row, i: number) => (
            <tr key={i}>
              <td>{r.sku}</td>
              <td>{r.mm_comercial}</td>
              <td>{r.mm_mat_type}</td>
              <td>{r.mm_mat_class}</td>
              <td>{r.sales_price_cents ?? ''}</td>
              <td>{r.avg_unit_cost_cents ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  )
}
