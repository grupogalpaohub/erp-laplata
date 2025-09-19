import { supabaseServer } from '@/src/lib/supabase/server'
export const revalidate = 0

export default async function Catalog(){
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('v_material_overview' as any)
    .select('sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents, avg_unit_cost_cents')
    .order('sku')
    .limit(300)
  if (error) return <div><h1 className="text-2xl font-bold mb-4">Catálogo de Materiais</h1><pre className="text-red-600">{error.message}</pre></div>
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Catálogo de Materiais</h1>
      <table className="min-w-full">
        <thead className="bg-gray-50"><tr>
          <th className="px-2 py-1 text-left">SKU</th>
          <th className="px-2 py-1 text-left">Comercial</th>
          <th className="px-2 py-1 text-left">Tipo</th>
          <th className="px-2 py-1 text-left">Classe</th>
          <th className="px-2 py-1 text-left">Preço</th>
          <th className="px-2 py-1 text-left">Custo Médio</th>
        </tr></thead>
        <tbody>
          {(data??[]).map((r:any)=>(
            <tr key={r.sku} className="border-t">
              <td className="px-2 py-1">{r.sku}</td>
              <td className="px-2 py-1">{r.mm_comercial}</td>
              <td className="px-2 py-1">{r.mm_mat_type}</td>
              <td className="px-2 py-1">{r.mm_mat_class}</td>
              <td className="px-2 py-1">{r.sales_price_cents}</td>
              <td className="px-2 py-1">{r.avg_unit_cost_cents}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
