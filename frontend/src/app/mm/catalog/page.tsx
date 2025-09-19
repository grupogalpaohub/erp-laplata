import { supabaseServer } from '@/src/lib/supabase/server'
export const revalidate = 0

export default async function Catalog() {
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('v_material_overview' as any)
    .select('sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents, avg_unit_cost_cents')
    .order('sku', { ascending: true })
    .limit(300)
  if (error) {
    return <main style={{padding:24}}><h1>Catálogo de Materiais</h1><pre style={{color:'crimson'}}>{error.message}</pre></main>
  }
  return (
    <main style={{ padding:24 }}>
      <h1 style={{ fontSize:28, fontWeight:700, marginBottom:16 }}>Catálogo de Materiais</h1>
      <table cellPadding={6}>
        <thead><tr>
          <th>SKU</th><th>Comercial</th><th>Tipo</th><th>Classe</th><th>Preço (centavos)</th><th>Custo Médio (centavos)</th>
        </tr></thead>
        <tbody>
        {(data ?? []).map((r: any) => (
          <tr key={r.sku}>
            <td>{r.sku}</td>
            <td>{r.mm_comercial}</td>
            <td>{r.mm_mat_type}</td>
            <td>{r.mm_mat_class}</td>
            <td>{r.sales_price_cents}</td>
            <td>{r.avg_unit_cost_cents}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </main>
  )
}