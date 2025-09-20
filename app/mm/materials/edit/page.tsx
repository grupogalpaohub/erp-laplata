export const dynamic = 'force-dynamic'
export const revalidate = 0
export const runtime = 'nodejs'
import { createClient } from '@/src/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function updateField(formData: FormData) {
  'use server'
  const supabase = createClient()
  const mm_material = String(formData.get('mm_material') || '')
  const field = String(formData.get('field') || '')
  const value = String(formData.get('value') || '')

  if (!mm_material || !field) throw new Error('Parâmetros inválidos')
  const patch: any = {}
  patch[field] = value
  const { error } = await supabase.from('mm_material').update(patch).eq('mm_material', mm_material)
  if (error) throw new Error(error.message)
  revalidatePath('/mm/materials/edit')
}

async function changePrice(formData: FormData) {
  'use server'
  const supabase = createClient()
  const mm_material = String(formData.get('mm_material') || '')
  const new_price_str = String(formData.get('new_price') || '')
  const new_price_cents = Math.round(Number(new_price_str.replace(',','.')) * 100)

  const { data: cur, error: e1 } = await supabase
    .from('mm_material')
    .select('mm_price_cents')
    .eq('mm_material', mm_material)
    .single()
  if (e1) throw new Error(e1.message)

  // DE-PARA visual seria implementado no client; aqui só aplicamos
  const { error: e2 } = await supabase
    .from('mm_material')
    .update({ mm_price_cents: new_price_cents })
    .eq('mm_material', mm_material)
  if (e2) throw new Error(e2.message)
  revalidatePath('/mm/materials/edit')
}

export default async function EditMaterialsPage() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('mm_material')
    .select('mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, lead_time_days, status, mm_vendor_id, mm_price_cents, price_last_updated_at')
    .order('mm_material')
  if (error) return <div className="p-6 text-red-600">Erro: {error.message}</div>

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Edição de Materiais</h1>
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-2 border">Material</th>
              <th className="p-2 border">Nome Comercial</th>
              <th className="p-2 border">Descrição</th>
              <th className="p-2 border">Tipo</th>
              <th className="p-2 border">Classe</th>
              <th className="p-2 border">Lead (dias)</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Fornecedor</th>
              <th className="p-2 border">Preço (R$)</th>
              <th className="p-2 border">Preço ↑ em</th>
              <th className="p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {(data ?? []).map((m:any) => (
              <tr key={m.mm_material}>
                <td className="p-2 border font-mono">{m.mm_material}</td>
                <td className="p-2 border">
                  <InlineEdit mm_material={m.mm_material} field="mm_comercial" value={m.mm_comercial}/>
                </td>
                <td className="p-2 border">
                  <InlineEdit mm_material={m.mm_material} field="mm_desc" value={m.mm_desc}/>
                </td>
                <td className="p-2 border">
                  <InlineEdit mm_material={m.mm_material} field="mm_mat_type" value={m.mm_mat_type}/>
                </td>
                <td className="p-2 border">
                  <InlineEdit mm_material={m.mm_material} field="mm_mat_class" value={m.mm_mat_class}/>
                </td>
                <td className="p-2 border text-right">
                  <InlineEdit mm_material={m.mm_material} field="lead_time_days" value={m.lead_time_days}/>
                </td>
                <td className="p-2 border">
                  <InlineEdit mm_material={m.mm_material} field="status" value={m.status}/>
                </td>
                <td className="p-2 border">
                  <InlineEdit mm_material={m.mm_material} field="mm_vendor_id" value={m.mm_vendor_id}/>
                </td>
                <td className="p-2 border text-right">R$ {(m.mm_price_cents/100).toFixed(2)}</td>
                <td className="p-2 border">{m.price_last_updated_at ? new Date(m.price_last_updated_at).toLocaleString() : '-'}</td>
                <td className="p-2 border">
                  <PriceModal mm_material={m.mm_material}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function InlineEdit({ mm_material, field, value }:{mm_material:string, field:string, value:any}) {
  return (
    <form action={updateField} className="flex gap-1">
      <input type="hidden" name="mm_material" value={mm_material}/>
      <input type="hidden" name="field" value={field}/>
      <input name="value" defaultValue={value ?? ''} className="border p-1 rounded w-40" />
      <button className="px-2 rounded border">Salvar</button>
    </form>
  )
}

function PriceModal({ mm_material }:{mm_material:string}) {
  return (
    <form action={changePrice} className="flex gap-1">
      <input type="hidden" name="mm_material" value={mm_material}/>
      <input name="new_price" placeholder="Novo preço (R$)" className="border p-1 rounded w-36 text-right"/>
      <button className="px-2 rounded bg-[#062238] text-white">Alterar preço</button>
    </form>
  )
}
