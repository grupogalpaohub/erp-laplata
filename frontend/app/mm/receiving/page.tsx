import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type Row = {
  mm_order: string
  plant_id: string | null
  mm_material: string | null
  qty_received: number | null
  received_at: string | null
}

export const revalidate = 0

export default async function ReceivingPage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('mm_receiving' as any)
    .select('mm_order,plant_id,mm_material,qty_received,received_at')
    .order('received_at', { ascending: false })
    .limit(500)

  if (error) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Recebimentos</h2>
      <pre style={{ color:'crimson' }}>{error.message}</pre>
    </main>
  }

  const cols = [
    { key: 'received_at', header: 'Recebido em' },
    { key: 'mm_order', header: 'Pedido' },
    { key: 'plant_id', header: 'Depósito' },
    { key: 'mm_material', header: 'Material' },
    { key: 'qty_received', header: 'Qtde' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Recebimentos</h2>
      <DataTable<Row> columns={cols as any} rows={(data || []) as any} />
    </main>
  )
}
