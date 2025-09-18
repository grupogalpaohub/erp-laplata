import { supabaseServer } from '@/lib/supabase/server'

type Material = {
  tenant_id: string | null
  mm_material: string | null
  mm_comercial: string | null
  mm_desc: string | null
  mm_mat_type: string | null
  mm_mat_class: string | null
  mm_price_cents: number | null
  status: string | null
}

export const revalidate = 0 // sempre dados recentes (somente leitura)

export default async function Page() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('mm_material')
    .select('tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, status')
    .order('mm_material', { ascending: true })
    .limit(300)

  if (error) {
    return (
      <div>
        <h1>Catálogo</h1>
        <p style={{color:'crimson'}}>Erro ao carregar materiais: {error.message}</p>
      </div>
    )
  }

  const rows = (data ?? []) as Material[]
  return (
    <div>
      <h1>Catálogo de Materiais</h1>
      {rows.length === 0 ? (
        <p>Nenhum material encontrado.</p>
      ) : (
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px'}}>Material</th>
              <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px'}}>Comercial</th>
              <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px'}}>Descrição</th>
              <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px'}}>Tipo</th>
              <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px'}}>Classe</th>
              <th style={{textAlign:'right', borderBottom:'1px solid #ddd', padding:'8px'}}>Preço</th>
              <th style={{textAlign:'left', borderBottom:'1px solid #ddd', padding:'8px'}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{borderBottom:'1px solid #eee', padding:'8px'}}>{r.mm_material}</td>
                <td style={{borderBottom:'1px solid #eee', padding:'8px'}}>{r.mm_comercial}</td>
                <td style={{borderBottom:'1px solid #eee', padding:'8px'}}>{r.mm_desc}</td>
                <td style={{borderBottom:'1px solid #eee', padding:'8px'}}>{r.mm_mat_type}</td>
                <td style={{borderBottom:'1px solid #eee', padding:'8px'}}>{r.mm_mat_class}</td>
                <td style={{borderBottom:'1px solid #eee', padding:'8px', textAlign:'right'}}>
                  {typeof r.mm_price_cents === 'number' ? (r.mm_price_cents/100).toLocaleString('pt-BR',{style:'currency', currency:'BRL'}) : '—'}
                </td>
                <td style={{borderBottom:'1px solid #eee', padding:'8px'}}>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
