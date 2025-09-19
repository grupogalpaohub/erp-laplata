import { supabaseServer } from '@/src/lib/supabase/server'

async function loadKpis(){
  const sb = await supabaseServer()
  const [mat, inv, po] = await Promise.all([
    sb.from('mm_material').select('mm_material', { count:'exact', head:true }),
    sb.from('wh_inventory_balance').select('mm_material', { count:'exact', head:true }),
    sb.from('mm_purchase_order').select('mm_order', { count:'exact', head:true }),
  ])
  return {
    materiais: (mat.count ?? 0),
    skusComSaldo: (inv.count ?? 0),
    pedidosCompra: (po.count ?? 0),
  }
}

export default async function Home(){
  const k = await loadKpis()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Controle</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded p-4"><div className="text-xs text-gray-500">Materiais</div><div className="text-2xl font-bold">{k.materiais}</div></div>
        <div className="border rounded p-4"><div className="text-xs text-gray-500">SKUs com saldo</div><div className="text-2xl font-bold">{k.skusComSaldo}</div></div>
        <div className="border rounded p-4"><div className="text-xs text-gray-500">Pedidos de Compra</div><div className="text-2xl font-bold">{k.pedidosCompra}</div></div>
      </div>
    </div>
  )
}