import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const { days = 60 } = await request.json().catch(() => ({ days: 60 }))

    // Executar função MRP
    const { error: mrpError } = await supabase.rpc('refresh_mrp', {
      p_tenant: tenantId,
      p_days: days
    })

    if (mrpError) {
      return NextResponse.json(
        { error: 'Erro ao executar MRP: ' + mrpError.message },
        { status: 500 }
      )
    }

    // Buscar sugestões geradas
    const { data: suggestions, error: fetchError } = await supabase
      .from('wh_mrp_suggestion')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('snapshot_at', { ascending: false })
      .limit(100)

    if (fetchError) {
      console.warn('Erro ao buscar sugestões MRP:', fetchError)
    }

    return NextResponse.json({
      success: true,
      message: `MRP executado com sucesso para ${days} dias`,
      suggestions_count: suggestions?.length || 0,
      suggestions: suggestions || []
    })

  } catch (error: any) {
    console.error('Error refreshing MRP:', error)
    return NextResponse.json(
      { error: 'Erro interno: ' + error.message },
      { status: 500 }
    )
  }
}
