import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = supabaseServer()
    
    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'

    // Buscar warehouses ativos
    const { data: warehouses, error } = await supabase
      .from('wh_warehouse')
      .select('warehouse_id, warehouse_name, location, status')
      .eq('tenant_id', tenant_id)
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