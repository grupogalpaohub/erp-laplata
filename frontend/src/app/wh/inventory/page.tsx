import { supabaseServer } from '@/src/lib/supabase/server'
export const revalidate = 0

export default async function Inventory(){
  const sb = await supabaseServer()
  const { data, error } = await sb
    .from('wh_inventory_balance')
    .select('plant_id, mm_material, on_hand_qty, reserved_qty, status')
    .order('mm_material').limit(1000)
  if (error) return <div><h1 className="text-2xl font-bold mb-4">Inventário</h1><pre className="text-red-600">{error.message}</pre></div>
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventário</h1>
      {(!data || data.length===0) ? <div>Nenhum registro encontrado.</div> : (
        <table className="min-w-full">
          <thead className="bg-gray-50"><tr>
            <th className="px-2 py-1 text-left">Planta</th>
            <th className="px-2 py-1 text-left">SKU</th>
            <th className="px-2 py-1 text-left">Em mãos</th>
            <th className="px-2 py-1 text-left">Reservado</th>
            <th className="px-2 py-1 text-left">Status</th>
          </tr></thead>
          <tbody>
            {data.map((r:any,i:number)=>(
              <tr key={i} className="border-t">
                <td className="px-2 py-1">{r.plant_id}</td>
                <td className="px-2 py-1">{r.mm_material}</td>
                <td className="px-2 py-1">{r.on_hand_qty}</td>
                <td className="px-2 py-1">{r.reserved_qty}</td>
                <td className="px-2 py-1">{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}