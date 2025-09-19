import { redirect } from 'next/navigation'
import { supabaseServer } from '@/src/lib/supabase/server'

export const revalidate = 0

async function getOptions() {
  const sb = await supabaseServer()
  const [cat, cls] = await Promise.all([
    sb.from('mm_category_def').select('category').eq('tenant_id', 'LaplataLunaria').eq('is_active', true).order('category', { ascending: true }),
    sb.from('mm_classification_def').select('classification').eq('tenant_id', 'LaplataLunaria').eq('is_active', true).order('classification', { ascending: true }),
  ])
  if (cat.error) throw new Error('Erro categorias: ' + cat.error.message)
  if (cls.error) throw new Error('Erro classificações: ' + cls.error.message)
  return {
    categories: (cat.data ?? []).map(r => r.category),
    classifications: (cls.data ?? []).map(r => r.classification),
  }
}

async function createMaterial(formData: FormData) {
  'use server'
  const sb = await supabaseServer()

  const mm_material = (formData.get('mm_material') as string)?.trim()
  const mm_comercial = (formData.get('mm_comercial') as string)?.trim() || null
  const mm_desc = (formData.get('mm_desc') as string)?.trim()
  const mm_mat_type = (formData.get('mm_mat_type') as string)?.trim()
  const mm_mat_class = (formData.get('mm_mat_class') as string)?.trim()
  const price = Number((formData.get('mm_price') as string || '0').replace(',', '.'))
  const mm_price_cents = Math.round(price * 100)
  const barcode = (formData.get('barcode') as string)?.trim() || null
  const weight_grams = formData.get('weight_grams') ? Number(formData.get('weight_grams')) : null

  if (!mm_material || !mm_desc || !mm_mat_type || !mm_mat_class) {
    throw new Error('Preencha os campos obrigatórios.')
  }

  const { error } = await sb.from('mm_material').insert({
    tenant_id: 'LaplataLunaria',
    mm_material,
    mm_comercial,
    mm_desc,
    mm_mat_type,
    mm_mat_class,
    mm_price_cents,
    barcode,
    weight_grams,
    status: 'active',
  })
  if (error) throw new Error(error.message)

  redirect('/mm/catalog')
}

export default async function Page() {
  const { categories, classifications } = await getOptions()

  return (
    <main style={{ padding: 24, maxWidth: 720 }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16 }}>Novo Material</h1>
      <form action={createMaterial} style={{ display: 'grid', gap: 12 }}>
        <label>
          Código do Material*<br/>
          <input name="mm_material" required placeholder="Ex: MAT-001" />
        </label>

        <label>
          Nome Comercial<br/>
          <input name="mm_comercial" placeholder="Ex: Brinco de Prata" />
        </label>

        <label>
          Descrição*<br/>
          <textarea name="mm_desc" required placeholder="Descrição detalhada do material" rows={3}/>
        </label>

        <label>
          Tipo de Material*<br/>
          <select name="mm_mat_type" required defaultValue="">
            <option value="" disabled>Selecione...</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Classificação*<br/>
          <select name="mm_mat_class" required defaultValue="">
            <option value="" disabled>Selecione...</option>
            {classifications.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label>
          Preço (R$)<br/>
          <input name="mm_price" type="number" step="0.01" min="0" defaultValue="0.00"/>
        </label>

        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
          <label>
            Peso (gramas)<br/>
            <input name="weight_grams" type="number" min="0" step="0.01"/>
          </label>
          <label>
            Código de Barras<br/>
            <input name="barcode" placeholder="EAN/GTIN"/>
          </label>
        </div>

        <div style={{ display:'flex', gap:12, marginTop:12 }}>
          <a href="/mm/catalog">Cancelar</a>
          <button type="submit">Salvar Material</button>
        </div>
      </form>
    </main>
  )
}