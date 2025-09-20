import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import FormCadastro from './ui'

export default async function CreateMaterialPage() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: () => {},
      },
    }
  )

  // opcional: carrega vendors para o select; se tabela não existir, segue vazio
  let vendors: Array<{ mm_vendor_id: string, name?: string | null }> = []
  try {
    const { data } = await supabase
      .from('mm_vendor')
      .select('mm_vendor_id, name')
      .order('name', { ascending: true })
    vendors = (data ?? []) as any
  } catch {}

  return <FormCadastro vendors={vendors} />
}