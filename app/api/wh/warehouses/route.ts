import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = supabaseServer()
    
    // GUARDRAIL: Verificar autenticação via supabaseServer()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: { code: 'UNAUTHORIZED', message: 'Usuário não autenticado' }
      }, { status: 401 })
    }

    // Buscar warehouses ativos - RLS filtra automaticamente por tenant_id
    const { data: warehouses, error } = await supabase
      .from('wh_warehouse')
      .select('warehouse_id, warehouse_name, location, status')
      .eq('status', 'active')
      .order('warehouse_name')

    if (error) {
      console.error('Error loading warehouses:', error)
      return NextResponse.json({
        ok: false,
        error: { code: error.code, message: error.message }
      }, { status: 500 })
    }

    return NextResponse.json({
      ok: true,
      data: warehouses || []
    })

  } catch (error: any) {
    console.error('Error loading warehouses:', error)
    return NextResponse.json({
      ok: false,
      error: { message: String(error?.message ?? error) }
    }, { status: 500 })
  }
}