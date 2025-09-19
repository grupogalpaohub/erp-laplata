import { supabaseServer } from '@/src/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

type Row = {
  vendor_id: string
  vendor_name: string | null
  email: string | null
  telefone: string | null
  cidade: string | null
  estado: string | null
  vendor_rating: string | null
}

export const revalidate = 0

export default async function VendorsPage() {
  const sb = supabaseServer()
  const { data, error } = await sb
    .from('mm_vendor' as any)
    .select('vendor_id,vendor_name,email,telefone,cidade,estado,vendor_rating')
    .order('vendor_name', { ascending: true })
    .limit(500)

  if (error) {
    return <main style={{ padding: '1.25rem' }}>
      <h2>Fornecedores</h2>
      <pre style={{ color:'crimson' }}>{error.message}</pre>
    </main>
  }

  const cols = [
    { key: 'vendor_id', header: 'ID' },
    { key: 'vendor_name', header: 'Fornecedor' },
    { key: 'email', header: 'Email' },
    { key: 'telefone', header: 'Telefone' },
    { key: 'cidade', header: 'Cidade' },
    { key: 'estado', header: 'UF' },
    { key: 'vendor_rating', header: 'Rating' },
  ] as const

  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Fornecedores</h2>
      <DataTable<Row> columns={cols as any} rows={(data || []) as any} />
    </main>
  )
}
