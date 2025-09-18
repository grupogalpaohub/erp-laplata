import { supabaseServer } from '@/lib/supabase'
type Row = {
  tenant_id: string
  mm_material: string
  mm_comercial: string
  mm_desc: string
  mm_mat_type: unknown
  mm_mat_class: unknown
  mm_price_cents: number
  status: string | null
}
export const dynamic = 'force-dynamic'
export default async function Page(){
  const sb = supabaseServer()
  const { data, error } = await sb
    .from<Row>('mm_material')
    .select('tenant_id, mm_material, mm_comercial, mm_desc, mm_mat_type, mm_mat_class, mm_price_cents, status')
    .order('mm_material', { ascending: true })
    .limit(300)
  if (error) throw new Error(`mm_material: ${error.message}`)
  if (!data || data.length === 0) return <div>Nenhum material encontrado.</div>
  return (
    <div style={{display:'grid', gap:16}}>
      <h1>Catálogo de Materiais</h1>
      <table style={{borderCollapse:'collapse', width:'100%'}}>
        <thead>
          <tr>
            <Th>SKU</Th><Th>Comercial</Th><Th>Descrição</Th>
            <Th>Categoria</Th><Th>Classificação</Th>
            <Th style={{textAlign:'right'}}>Preço</Th><Th>Status</Th>
          </tr>
        </thead>
        <tbody>
          {data.map(r=>(
            <tr key={r.mm_material}>
              <Td>{r.mm_material}</Td>
              <Td>{r.mm_comercial}</Td>
              <Td>{r.mm_desc}</Td>
              <Td>{String(r.mm_mat_type)}</Td>
              <Td>{String(r.mm_mat_class)}</Td>
              <Td style={{textAlign:'right'}}>R$ {(r.mm_price_cents/100).toFixed(2)}</Td>
              <Td>{r.status ?? ''}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
function Th(p:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <th style={{borderBottom:'1px solid #ddd', textAlign:'left', padding:'8px', fontWeight:600, ...(p.style||{})}}>{p.children}</th>
}
function Td(p:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <td style={{borderBottom:'1px solid #eee', padding:'8px', ...(p.style||{})}}>{p.children}</td>
}
