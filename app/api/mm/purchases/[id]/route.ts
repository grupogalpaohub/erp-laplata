import { NextResponse } from 'next/server'
import { ensureServerSession } from '@/utils/auth/ensureServerSession'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const supabase = await ensureServerSession(req)
  const { data: u } = await supabase.auth.getUser()
  if (!u?.user) return NextResponse.json({ ok: false, error: 'UNAUTHENTICATED' }, { status: 401 })

  // --- DAQUI PRA BAIXO SUA LÓGICA NORMAL ---
  // Ex.: carregar purchase order pelo ID usando RLS
  const TENANT = 'LaplataLunaria'
  const { data, error } = await supabase
    .from('mm_purchase_order')
    .select('*')
    .eq('tenant_id', TENANT)
    .eq('po_id', params.id)
    .single()

  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 400 })
  return NextResponse.json({ ok: true, data })
}
