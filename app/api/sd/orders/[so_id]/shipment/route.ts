import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(
  request: Request,
  { params }: { params: { so_id: string } }
) {
  try {
    const supabase = supabaseServer()
    const { so_id } = params

    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 })
    }

    // Buscar shipment do pedido - RLS filtra automaticamente por tenant_id
    const { data: shipment, error } = await supabase
      .from('sd_shipment')
      .select(`
        shipment_id,
        so_id,
        warehouse_id,
        ship_date,
        status,
        created_at
      `)
      .eq('so_id', so_id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhum shipment encontrado
        return NextResponse.json({
          ok: false,
          error: { code: 'SHIPMENT_NOT_FOUND', message: 'Nenhum shipment encontrado para este pedido' }
        }, { status: 404 })
      }
      
      console.error('Error loading shipment:', error)
      return NextResponse.json({
        ok: false,
        error: { code: error.code, message: error.message }
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: shipment
    })

  } catch (error: any) {
    console.error('Error loading shipment:', error)
    return NextResponse.json({
      ok: false,
      error: { message: String(error?.message ?? error) }
    }, { status: 500 })
  }
}
