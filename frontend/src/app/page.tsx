import { supabaseServer } from '@/src/lib/supabase/server'

export const revalidate = 0

async function kpiCount(sb: ReturnType<typeof supabaseServer>, table: string) {
  const { count } = await sb.from(table as any).select('*', { count: 'exact', head: true })
  return count ?? 0
}

export default async function Home() {
  const sb = supabaseServer()
  const [materials, stockItems, salesOrders] = await Promise.all([
    kpiCount(sb, 'v_material_overview'),
    kpiCount(sb, 'wh_inventory_balance'),
    kpiCount(sb, 'sd_sales_order'),
  ])

  return (
    <>
      <h2>Controle</h2>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4, minmax(180px, 1fr))', gap:12, margin:'12px 0 24px' }}>
        <KPI title="Materiais" value={materials} hint="v_material_overview" />
        <KPI title="Itens com estoque" value={stockItems} hint="wh_inventory_balance" />
        <KPI title="Pedidos de venda" value={salesOrders} hint="sd_sales_order" />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(3, minmax(220px, 1fr))', gap:12 }}>
        <Tile href="/mm/catalog" title="Catálogo de Materiais" subtitle="Lista e preços" />
        <Tile href="/wh/inventory" title="Inventário" subtitle="Saldos por SKU" />
        <Tile href="/sd/orders" title="Pedidos de Venda" subtitle="Lista e detalhe" />
      </div>
    </>
  )
}

function KPI({ title, value, hint }: { title:string, value:number|string, hint?:string }) {
  return (
    <div style={{ border:'1px solid #eee', borderRadius:12, padding:'14px' }}>
      <div style={{ fontSize:12, color:'#666' }}>{title}</div>
      <div style={{ fontSize:28, fontWeight:700, lineHeight:'32px' }}>{value}</div>
      {hint ? <div style={{ fontSize:12, color:'#999' }}>{hint}</div> : null}
    </div>
  )
}
function Tile({ href, title, subtitle }: { href:string, title:string, subtitle?:string }) {
  return (
    <a href={href} style={{ display:'block', border:'1px solid #eee', borderRadius:16, padding:'16px', textDecoration:'none' }}>
      <div style={{ fontWeight:600 }}>{title}</div>
      {subtitle && <div style={{ color:'#666', fontSize:12 }}>{subtitle}</div>}
    </a>
  )
}
