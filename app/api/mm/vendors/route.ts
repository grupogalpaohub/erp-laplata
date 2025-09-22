import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('vendor_name')

    if (error) {
      console.error('Error fetching vendors:', error)
      return NextResponse.json({ error: 'Erro ao buscar fornecedores' }, { status: 500 })
    }

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
