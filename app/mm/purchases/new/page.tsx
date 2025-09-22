export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import PriceDisplay from './PriceDisplay'

async function createPO(formData: FormData) {
  'use server'
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()

  // Header
  const header = {
    tenant_id: tenantId,
    mm_order: `PO-${Date.now()}`, // Gerar ID único
    vendor_id: String(formData.get('vendor_id') || ''),
    po_date: String(formData.get('po_date') || new Date().toISOString().slice(0,10)),
    status: 'draft' as const
  }
  if (!header.vendor_id) throw new Error('Fornecedor é obrigatório')

  const { data: h, error: eH } = await supabase
    .from('mm_purchase_order')
    .insert(header)
    .select('mm_order')
    .single()
  if (eH) throw new Error(eH.message)

  // Itens (linhas 0..n)
  const count = Number(formData.get('rows') || 0)
  const items: any[] = []
  for (let i=0;i<count;i++){
    const material = String(formData.get(`item_${i}_mm_material`) || '')
    const qttStr = String(formData.get(`item_${i}_mm_qtt`) || '')
    const quantity = Number(qttStr)
    if (material && quantity > 0) {
      items.push({ 
        tenant_id: tenantId,
        mm_order: h.mm_order, 
        plant_id: 'DEFAULT', // Usar depósito padrão
        mm_material: material, 
        mm_qtt: quantity,
        unit_cost_cents: 0, // Será preenchido pelo trigger
        line_total_cents: 0 // Será calculado pelo trigger
      })
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
  const supabase = createSupabaseServerClient()
  const tenantId = await getTenantId()
  
  console.log('NewPOPage - tenantId:', tenantId)
  
  const { data: vendors, error: vendorError } = await supabase
    .from('mm_vendor')
    .select('vendor_id, vendor_name')
    .eq('tenant_id', tenantId)
    .order('vendor_name')
  
  const { data: materials, error: materialError } = await supabase
    .from('mm_material')
    .select('mm_material, mm_comercial, mm_desc, mm_price_cents, mm_vendor_id')
    .eq('tenant_id', tenantId)
    .order('mm_material')

  console.log('NewPOPage - vendors:', vendors?.length || 0, 'error:', vendorError?.message)
  console.log('NewPOPage - materials:', materials?.length || 0, 'error:', materialError?.message)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Criar Pedido de Compras</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerar novo pedido de compras</p>
        <p className="text-lg text-fiori-muted">Selecione fornecedor e materiais para criar o pedido</p>
      </div>

      {/* Debug Info */}
      <div className="bg-fiori-secondary p-4 rounded border">
        <h3 className="text-sm font-semibold text-fiori-primary mb-2">Debug Info:</h3>
        <p className="text-xs text-fiori-secondary">Tenant ID: {tenantId}</p>
        <p className="text-xs text-fiori-secondary">Fornecedores: {vendors?.length || 0} {vendorError && `(Erro: ${vendorError.message})`}</p>
        <p className="text-xs text-fiori-secondary">Materiais: {materials?.length || 0} {materialError && `(Erro: ${materialError.message})`}</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/purchases" className="btn-fiori-outline">Voltar</Link>
      </div>

      <form action={createPO} className="form-fiori">
        <section className="grid-fiori-3">
          <div className="form-group">
            <label className="label-fiori">Fornecedor</label>
            <select name="vendor_id" className="select-fiori" required>
              <option value="">Selecione…</option>
              {(vendors ?? []).map(v => (
                <option key={v.vendor_id} value={v.vendor_id}>{v.vendor_name || v.vendor_id}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="label-fiori">Data</label>
            <input type="date" name="po_date" className="input-fiori" defaultValue={new Date().toISOString().slice(0,10)}/>
          </div>
          <div className="form-group">
            <label className="label-fiori">Status</label>
            <input className="input-fiori bg-fiori-secondary" value="draft" readOnly/>
          </div>
        </section>

        <ItemsTable materials={materials ?? []}/>
      </form>
    </div>
  )
}

function ItemsTable({ materials }: { materials: any[] }) {
  // Renderiza 5 linhas por padrão; evolutivo para adicionar/remover linhas depois
  const rows = Array.from({length:5}, (_,i)=>i)
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-fiori-primary">Itens</h2>
      <input type="hidden" name="rows" value={rows.length}/>
      <div className="overflow-x-auto">
        <table className="table-fiori">
          <thead>
            <tr>
              <th>Material</th>
              <th className="text-right">Preço atual (R$)</th>
              <th className="text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(i => (
              <tr key={i}>
                <td>
                  <select name={`item_${i}_mm_material`} className="select-fiori w-full">
                    <option value="">—</option>
                    {materials.map(m => (
                      <option key={m.mm_material} value={m.mm_material}>
                        {m.mm_material} — {m.mm_comercial ?? m.mm_desc} (Fornecedor: {m.mm_vendor_id})
                      </option>
                    ))}
                  </select>
                </td>
                <td className="text-right">
                  <PriceDisplay materials={materials} materialIndex={i} />
                </td>
                <td className="text-right">
                  <input type="number" min="0" step="1" name={`item_${i}_mm_qtt`} className="input-fiori w-32 text-right" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button type="submit" className="btn-fiori-primary">Salvar Pedido</button>
    </section>
  )
}
