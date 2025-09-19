import { supabaseServer } from '@/src/lib/supabase/server'
import { getTenantId, getMaterials, getVendors, getDefaultPlantId, getDefaultPOStatus } from '@/src/lib/db/options'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function NewPO(){
  const [materials, vendors] = await Promise.all([getMaterials(), getVendors()])

  async function createPO(formData: FormData){
    "use server"
    const sb = await supabaseServer()
    const tenant_id = await getTenantId()
    const plant_id = await getDefaultPlantId()
    const status = await getDefaultPOStatus()

    const vendor_id = String(formData.get('vendor_id')||'')
    const po_date = String(formData.get('po_date')||'')
    const expected_delivery = String(formData.get('expected_delivery')||'')
    const notes = String(formData.get('notes')||'')
    const items = JSON.parse(String(formData.get('items_json')||'[]')) as Array<{ mm_material:string; qty:number; unit_cost_cents:number }>

    const { data: seq, error: eSeq } = await sb.rpc('next_doc_number', { p_tenant: tenant_id, p_doc_type: 'PO' })
    if (eSeq) throw eSeq
    const mm_order = String(seq)

    const { error: eH } = await sb.from('mm_purchase_order').insert({ tenant_id, mm_order, vendor_id, status, po_date, expected_delivery, notes })
    if (eH) throw eH

    if (items.length){
      const rows = items.map((it, idx)=>({
        tenant_id, mm_order, plant_id,
        mm_material: it.mm_material,
        mm_qtt: Number(it.qty)||0,
        unit_cost_cents: Math.round(Number(it.unit_cost_cents)||0),
        line_total_cents: Math.round((Number(it.qty)||0) * (Number(it.unit_cost_cents)||0)),
        row_no: idx+1
      }))
      const { error: eI } = await sb.from('mm_purchase_order_item').insert(rows)
      if (eI) throw eI
    }

    redirect(`/mm/purchases/${encodeURIComponent(mm_order)}`)
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold mb-4">Novo Pedido de Compra</h1>
      <form action={createPO} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <label className="block">Fornecedor*<br/>
            <select name="vendor_id" required className="border rounded px-2 py-1 w-full" defaultValue="">
              <option value="" disabled>Selecione…</option>
              {vendors.map(v=> <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name}</option>)}
            </select>
          </label>
          <label className="block">Data<br/><input type="date" name="po_date" className="border rounded px-2 py-1 w-full"/></label>
          <label className="block">Entrega Prevista<br/><input type="date" name="expected_delivery" className="border rounded px-2 py-1 w-full"/></label>
        </div>
        <label className="block">Observações<br/><textarea name="notes" rows={2} className="border rounded px-2 py-1 w-full"/></label>

        <div className="rounded border">
          <div className="p-2 font-semibold">Itens</div>
          <table className="w-full">
            <thead className="bg-gray-50"><tr><th className="p-2">SKU</th><th className="p-2">Qtde</th><th className="p-2">Custo (centavos)</th><th className="p-2">Total</th><th></th></tr></thead>
            <tbody id="poItemsBody"></tbody>
          </table>
          <div className="p-2"><button type="button" className="underline" onClick={()=>{
            (window as any).__PO_ITEMS__ = (window as any).__PO_ITEMS__ || []
            const idx = (window as any).__PO_ITEMS__.length
            const body = document.getElementById('poItemsBody')!
            const tr = document.createElement('tr')
            tr.innerHTML = `
              <td class="p-2">
                <select class="input sku">
                  ${materials.map(m=>`<option value="${m.mm_material}">${m.mm_material} — ${m.mm_comercial||''}</option>`).join('')}
                </select>
              </td>
              <td class="p-2"><input type="number" class="input qty" value="1" min="1"/></td>
              <td class="p-2"><input type="number" class="input price" value="0" min="0"/></td>
              <td class="p-2 total">0</td>
              <td class="p-2"><button type="button" class="text-sm underline rm">remover</button></td>
            `
            body.appendChild(tr)
            const sync = ()=>{
              const sku = (tr.querySelector('.sku') as HTMLSelectElement).value
              const qty = Number((tr.querySelector('.qty') as HTMLInputElement).value||0)
              const price = Number((tr.querySelector('.price') as HTMLInputElement).value||0)
              const total = qty*price; (tr.querySelector('.total') as HTMLElement).textContent = String(total)
              ;(window as any).__PO_ITEMS__[idx] = { mm_material: sku, qty, unit_cost_cents: price }
            }
            tr.querySelectorAll('select,input').forEach(el=> el.addEventListener('change', sync))
            ;(tr.querySelector('.rm') as HTMLButtonElement).onclick = ()=>{ tr.remove(); (window as any).__PO_ITEMS__[idx]=null }
            sync()
          }}>Adicionar item</button></div>
        </div>

        <input type="hidden" name="items_json" id="items_json"/>
        <div className="flex gap-3">
          <a href="/mm/purchases" className="underline">Cancelar</a>
          <button className="bg-black text-white px-3 py-1 rounded" onClick={()=>{
            const el = document.getElementById('items_json') as HTMLInputElement
            el.value = JSON.stringify((window as any).__PO_ITEMS__ || [])
          }}>Salvar Pedido</button>
        </div>
      </form>
    </div>
  )
}
