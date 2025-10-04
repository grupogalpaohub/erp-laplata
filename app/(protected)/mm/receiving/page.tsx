export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';

import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
// import { DataTable } from '@/components/DataTable'

type Row = {
  mm_order: string
  plant_id: string | null
  mm_material: string | null
  qty_received: number | null
  received_at: string | null
}

export default async function ReceivingPage() {
  const sb = supabaseServerReadOnly()
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
      <div className="text-center py-8">
        <p className="text-gray-500">Funcionalidade de recebimentos em desenvolvimento</p>
      </div>
    </main>
  )
}



