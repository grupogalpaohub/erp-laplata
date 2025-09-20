export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
import { createClient } from '@/src/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'

async function createPO(formData: FormData) {
  'use server'
  const supabase = createClient()

  // Header
  const header = {
    mm_vendor_id: String(formData.get('mm_vendor_id') || ''),
    order_date: String(formData.get('order_date') || new Date().toISOString().slice(0,10)),
    status: 'rascunho' as const
  }
  if (!header.mm_vendor_id) throw new Error('Fornecedor é obrigatório')

  const { data: h, error: eH } = await supabase
    .from('mm_purchase_order')
    .insert(header)
    .select('po_id')
    .single()
  if (eH) throw new Error(eH.message)

  // Itens (linhas 0..n)
  const count = Number(formData.get('rows') || 0)
  const items: any[] = []
  for (let i=0;i<count;i++){
    const material = String(formData.get(`item_${i}_mm_material`) || '')
    const qttStr = String(formData.get(`item_${i}_mm_qtt`) || '')
    const mm_qtt = Number(qttStr)
    if (material && mm_qtt > 0) {
      items.push({ po_id: h.po_id, mm_material: material, mm_qtt })
    }
  }
  if (items.length === 0) throw new Error('Adicione ao menos um item com quantidade')

  const { error: eI } = await supabase.from('mm_purchase_order_item').insert(items)
  if (eI) throw new Error(eI.message)

  // Atualiza cache e navega – Server Actions devem retornar void
  revalidatePath('/mm/purchases')
  redirect('/mm/purchases')
}

export default async function NewPOPage() {
  const supabase = createClient()
  const { data: vendors } = await supabase.from('mm_vendor').select('vendor_id, vendor_name').order('vendor_name')
  const { data: materials } = await supabase
    .from('mm_material')
    .select('mm_material, mm_comercial, mm_price_cents, mm_vendor_id')
    .order('mm_material')

  return (
    <main className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Criar Pedido de Compras</h1>
        <Link href="/mm/purchases" className="px-3 py-2 rounded border">Voltar</Link>
      </div>

      <form action={createPO} className="space-y-6">
        <section className="grid md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm">Fornecedor</label>
            <select name="mm_vendor_id" className="border p-2 rounded" required>
              <option value="">Selecione…</option>
              {(vendors ?? []).map(v => (
                <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name || v.vendor_id}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Data</label>
            <input type="date" name="order_date" className="border p-2 rounded" defaultValue={new Date().toISOString().slice(0,10)}/>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-sm">Status</label>
            <input className="border p-2 rounded bg-gray-50" value="rascunho" readOnly/>
          </div>
        </section>

        <ItemsTable materials={materials ?? []}/>
      </form>
    </main>
  )
}

function ItemsTable({ materials }: { materials: any[] }) {
  // Renderiza 5 linhas por padrão; evolutivo para adicionar/remover linhas depois
  const rows = Array.from({length:5}, (_,i)=>i)
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">Itens</h2>
      <input type="hidden" name="rows" value={rows.length}/>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border text-left">Material</th>
              <th className="p-2 border text-right">Preço atual (R$)</th>
              <th className="p-2 border text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(i => (
              <tr key={i}>
                <td className="p-2 border">
                  <select name={`item_${i}_mm_material`} className="border p-2 rounded w-full">
                    <option value="">—</option>
                    {materials.map(m => (
                      <option key={m.mm_material} value={m.mm_material}>
                        {m.mm_material} — {m.mm_comercial ?? ''} (Fornecedor: {m.mm_vendor_id})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-2 border text-right">
                  {/* Dica visual: mostra preço atual (não enviado), o server congela no trigger */}
                  {/* Em versão futura podemos renderizar preço atual para preview */}
                </td>
                <td className="p-2 border text-right">
                  <input type="number" min="0" step="1" name={`item_${i}_mm_qtt`} className="border p-2 rounded w-32 text-right" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="px-3 py-2 rounded bg-[#062238] text-white">Salvar Pedido</button>
    </section>
  )
}