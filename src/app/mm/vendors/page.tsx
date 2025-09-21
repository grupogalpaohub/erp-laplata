import { createSupabaseServerClient } from '@/lib/supabase/server'
import { DataTable } from '@/src/components/DataTable'

export const revalidate = 0

export default async function VendorsPage() {
  const sb = createSupabaseServerClient()
  const { data, error } = await sb.from('mm_vendor' as any).select('*').order('name', { ascending: true }).limit(500)
  if (error) return <main><h2>Fornecedores</h2><pre style={{ color:'crimson' }}>{error.message}</pre></main>
  return (
    <main>
      <h2>Fornecedores</h2>
      <DataTable rows={(data ?? []) as any[]} />
    </main>
  )
}
