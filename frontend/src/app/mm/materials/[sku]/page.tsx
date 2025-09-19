import { supabaseServer } from '@/src/lib/supabase/server'
import { getMaterialTypes, getMaterialClassifications } from '@/src/lib/db/options'
import { redirect } from 'next/navigation'

export const revalidate = 0

export default async function Edit({ params }:{ params:{ sku:string } }){
  const sb = await supabaseServer()
  const { data: mat } = await sb.from('mm_material').select('*').eq('mm_material', params.sku).single()
  const [types, classes] = await Promise.all([getMaterialTypes(), getMaterialClassifications()])

  async function save(formData: FormData){
    "use server"
    const sb = await supabaseServer()
    const sku = String(formData.get('mm_material')||'').trim()
    const mm_comercial = String(formData.get('mm_comercial')||'').trim()||null
    const mm_desc = String(formData.get('mm_desc')||'').trim()
    const mm_mat_type = String(formData.get('mm_mat_type')||'').trim()
    const mm_mat_class = String(formData.get('mm_mat_class')||'').trim()
    const mm_price_cents = Math.round(Number(String(formData.get('mm_price')||'0').replace(',','.'))*100)||0
    const status = String(formData.get('status')||'active')
    const { error } = await sb.from('mm_material').update({
      mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, status
    }).eq('mm_material', sku)
    if (error) throw error
    redirect('/mm/materials')
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">Editar Material</h1>
      {!mat ? <div>Material não encontrado.</div> : (
        <form action={save} className="space-y-3">
          <input type="hidden" name="mm_material" defaultValue={mat.mm_material}/>
          <div className="text-sm text-gray-500">SKU: {mat.mm_material}</div>
          <label className="block">Comercial<br/><input name="mm_comercial" defaultValue={mat.mm_comercial??''} className="border rounded px-2 py-1 w-full"/></label>
          <label className="block">Descrição<br/><textarea name="mm_desc" defaultValue={mat.mm_desc??''} rows={3} className="border rounded px-2 py-1 w-full"/></label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="block">Tipo<br/>
              <select name="mm_mat_type" defaultValue={mat.mm_mat_type??''} className="border rounded px-2 py-1 w-full">
                {types.map((t:string)=><option key={t} value={t}>{t}</option>)}
              </select>
            </label>
            <label className="block">Classe<br/>
              <select name="mm_mat_class" defaultValue={mat.mm_mat_class??''} className="border rounded px-2 py-1 w-full">
                {classes.map((c:string)=><option key={c} value={c}>{c}</option>)}
              </select>
            </label>
          </div>
          <label className="block">Preço (R$)<br/><input name="mm_price" type="number" step="0.01" defaultValue={(mat.mm_price_cents??0)/100} className="border rounded px-2 py-1 w-full"/></label>
          <label className="block">Status<br/>
            <select name="status" defaultValue={mat.status??'active'} className="border rounded px-2 py-1 w-full">
              <option value="active">active</option>
              <option value="blocked">blocked</option>
            </select>
          </label>
          <div className="flex gap-3">
            <a href="/mm/materials" className="underline">Voltar</a>
            <button className="bg-black text-white px-3 py-1 rounded">Salvar</button>
          </div>
        </form>
      )}
    </div>
  )
}
