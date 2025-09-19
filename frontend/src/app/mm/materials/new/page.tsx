import { redirect } from 'next/navigation'
import { supabaseServer } from '@/src/lib/supabase/server'
import { getTenantId, getMaterialTypes, getMaterialClassifications, getDefaultMaterialStatus } from '@/src/lib/db/options'

export const revalidate = 0

async function createMaterial(formData: FormData) {
  'use server'
  const sb = await supabaseServer()
  const tenant_id = await getTenantId()
  const status = await getDefaultMaterialStatus()

  const mm_material = String(formData.get('mm_material')||'').trim()
  const mm_comercial = (String(formData.get('mm_comercial')||'').trim()) || null
  const mm_desc = String(formData.get('mm_desc')||'').trim()
  const mm_mat_type = String(formData.get('mm_mat_type')||'').trim()
  const mm_mat_class = String(formData.get('mm_mat_class')||'').trim()
  const mm_price_cents = Math.round(Number(String(formData.get('mm_price')||'0').replace(',','.'))*100)||0
  const barcode = (String(formData.get('barcode')||'').trim()) || null
  const weight_grams = formData.get('weight_grams') ? Number(formData.get('weight_grams')) : null

  if(!mm_material || !mm_desc || !mm_mat_type || !mm_mat_class) throw new Error('Campos obrigatórios')

  const { error } = await sb.from('mm_material').insert({
    tenant_id, mm_material, mm_comercial, mm_desc,
    mm_mat_type, mm_mat_class, mm_price_cents,
    barcode, weight_grams, status
  })
  if (error) throw new Error(error.message)
  redirect('/mm/materials')
}

export default async function Page(){
  const [types, classes] = await Promise.all([getMaterialTypes(), getMaterialClassifications()])
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Novo Material</h1>
      <form action={createMaterial} className="space-y-3">
        <label className="block">SKU*<br/><input name="mm_material" required className="border rounded px-2 py-1 w-full"/></label>
        <label className="block">Comercial<br/><input name="mm_comercial" className="border rounded px-2 py-1 w-full"/></label>
        <label className="block">Descrição*<br/><textarea name="mm_desc" required rows={3} className="border rounded px-2 py-1 w-full"/></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">Tipo*<br/>
            <select name="mm_mat_type" required className="border rounded px-2 py-1 w-full">
              <option value="" disabled>Selecione…</option>
              {types.map(t=><option key={t} value={t}>{t}</option>)}
            </select>
          </label>
          <label className="block">Classe*<br/>
            <select name="mm_mat_class" required className="border rounded px-2 py-1 w-full">
              <option value="" disabled>Selecione…</option>
              {classes.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>
        <label className="block">Preço (R$)<br/><input name="mm_price" type="number" step="0.01" defaultValue="0.00" className="border rounded px-2 py-1 w-full"/></label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <label className="block">Peso (g)<br/><input name="weight_grams" type="number" className="border rounded px-2 py-1 w-full"/></label>
          <label className="block">Código de Barras<br/><input name="barcode" className="border rounded px-2 py-1 w-full"/></label>
        </div>
        <div className="flex gap-3">
          <a href="/mm/materials" className="underline">Cancelar</a>
          <button className="bg-black text-white px-3 py-1 rounded">Salvar</button>
        </div>
      </form>
    </div>
  )
}
