import { createSupabaseServerClient } from '@/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

export const revalidate = 0

export default async function InventoryPage() {
  const sb = createSupabaseServerClient()
  const { data, error } = await sb
    .from('wh_inventory_balance' as any)
    .select('tenant_id, plant_id, mm_material, on_hand_qty, reserved_qty, last_count_date, status')
    .order('mm_material', { ascending: true })
    .limit(1000)
  if (error) return <main><h2>Inventário</h2><pre style={{ color:'crimson' }}>{error.message}</pre></main>
  return (
    <main>
      <h2>Inventário</h2>
      <DataTable rows={(data ?? []) as any[]} />
    </main>
  )
}
