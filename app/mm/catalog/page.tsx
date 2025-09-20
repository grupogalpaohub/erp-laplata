export const dynamic = 'force-dynamic'
export const revalidate = 0
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

type Material = {
  mm_material: string
  mm_comercial: string | null
  mm_desc: string
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
  commercial_name: string | null
  lead_time_days: number | null
  mm_vendor_id: string | null
  status: string | null
  mm_vendor?: { vendor_name: string }[]
}

export default async function CatalogoMateriais() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  const { data, error } = await supabase
    .from('mm_material')
    .select(`
      mm_material, 
      mm_comercial, 
      mm_desc, 
      mm_mat_type, 
      mm_mat_class, 
      mm_price_cents, 
      commercial_name, 
      lead_time_days, 
      mm_vendor_id, 
      status,
      mm_vendor!mm_vendor_id(vendor_name)
    `)
    .eq('tenant_id', 'LaplataLunaria')
    .order('mm_material', { ascending: true })
  
  console.log('[catalog] query result:', { data, error })

  if (error) {
    return (
      <main className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Catálogo de Materiais</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Erro ao carregar materiais: {error.message}
        </div>
      </main>
    )
  }

  const materiais = (data ?? []) as Material[]

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Catálogo de Materiais</h1>

      {materiais.length === 0 ? (
        <div className="text-center py-8 text-gray-500">Nenhum material encontrado.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">SKU</th>
                <th className="border border-gray-300 p-2 text-left">Nome Comercial</th>
                <th className="border border-gray-300 p-2 text-left">Descrição</th>
                <th className="border border-gray-300 p-2 text-left">Tipo</th>
                <th className="border border-gray-300 p-2 text-left">Classe</th>
                <th className="border border-gray-300 p-2 text-left">Preço (R$)</th>
                <th className="border border-gray-300 p-2 text-left">Fornecedor</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Lead Time</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((material) => (
                <tr key={material.mm_material} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-mono text-sm">{material.mm_material}</td>
                  <td className="border border-gray-300 p-2">
                    {material.mm_comercial || material.commercial_name || "-"}
                  </td>
                  <td className="border border-gray-300 p-2 max-w-xs truncate">{material.mm_desc}</td>
                  <td className="border border-gray-300 p-2">{material.mm_mat_type || "-"}</td>
                  <td className="border border-gray-300 p-2">{material.mm_mat_class || "-"}</td>
                  <td className="border border-gray-300 p-2 text-right">
                    {material.mm_price_cents != null ? `R$ ${(material.mm_price_cents / 100).toFixed(2)}` : "-"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {(material.mm_vendor?.[0]?.vendor_name ?? material.mm_vendor_id ?? "-")}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      (material.status ?? 'active') === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {material.status ?? 'active'}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {material.lead_time_days != null ? `${material.lead_time_days} dias` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}