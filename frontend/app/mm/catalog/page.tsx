import { supabaseServer } from '@/lib/supabase'

type Row = {
  tenant_id: string
  mm_material: string      // SKU (chave real que você usa)
  mm_comercial: string     // nome comercial
  mm_desc: string          // descrição
  mm_mat_type: unknown     // enum real
  mm_mat_class: unknown    // enum real
  mm_price_cents: number   // preço em centavos
  status: string | null
}

export const dynamic = 'force-dynamic'

export default async function Page(){
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('mm_material')
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
            <Th>SKU</Th>
            <Th>Comercial</Th>
            <Th>Descrição</Th>
            <Th>Categoria</Th>
            <Th>Classificação</Th>
            <Th style={{textAlign:'right'}}>Preço</Th>
            <Th>Status</Th>
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

function Th(props:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <th style={{borderBottom:'1px solid #ddd', textAlign:'left', padding:'8px', fontWeight:600, ...(props.style||{})}}>{props.children}</th>
}
function Td(props:React.PropsWithChildren<{style?:React.CSSProperties}>){
  return <td style={{borderBottom:'1px solid #eee', padding:'8px', ...(props.style||{})}}>{props.children}</td>
}
