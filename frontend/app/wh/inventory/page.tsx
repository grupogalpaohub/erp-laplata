import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type Row = {
  plant_id: string | null
  mm_material: string | null
  on_hand_qty: number | null
  reserved_qty: number | null
  last_count_date: string | null
  status: string | null
}

export const revalidate = 0

export default async function InventoryBalancePage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('wh_inventory_balance' as any)
    .select('plant_id,mm_material,on_hand_qty,reserved_qty,last_count_date,status')
    .order('mm_material', { ascending: true })
    .limit(1000)

  if (error) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Inventário</h2>
      <pre style={{ color:'crimson' }}>{error.message}</pre>
    </main>
  }

  const cols = [
    { key: 'plant_id', header: 'Depósito' },
    { key: 'mm_material', header: 'Material' },
    { key: 'on_hand_qty', header: 'Em mãos' },
    { key: 'reserved_qty', header: 'Reservado' },
    { key: 'last_count_date', header: 'Último inventário' },
    { key: 'status', header: 'Status' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Inventário</h2>
      <DataTable columns={cols as any} rows={(data || []) as any} />
    </main>
  )
}
