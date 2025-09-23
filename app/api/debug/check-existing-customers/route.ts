import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    const { data: customers, error } = await supabase
      .from('crm_customer')
      .select('customer_id, name, document_id, email')
      .eq('tenant_id', tenantId)
      .limit(5)

    return NextResponse.json({
      success: true,
      customers: customers || [],
      error
    })

  } catch (error: any) {
    console.error('Erro ao buscar clientes:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
