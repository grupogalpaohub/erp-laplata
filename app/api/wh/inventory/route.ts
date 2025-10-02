import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // Tenant fixo conforme guardrails
    const TENANT_ID = "LaplataLunaria"
    
    // Buscar parâmetros de query
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const pageSize = parseInt(searchParams.get('pageSize') || '50')
    const warehouse_id = searchParams.get('warehouse_id')
    const mm_material = searchParams.get('mm_material')
    
    // Construir query base
    let query = supabase
      .from('wh_inventory')
      .select(`
        mm_material,
        warehouse_id,
        on_hand_qty,
        reserved_qty,
        ultimo_unit_cost_cents_por_material,
        last_updated
      `, { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
      .gt('on_hand_qty', 0) // Apenas itens com estoque
    
    // Aplicar filtros
    if (warehouse_id) {
      query = query.eq('warehouse_id', warehouse_id)
    }
    
    if (mm_material) {
      query = query.ilike('mm_material', `%${mm_material}%`)
    }
    
    // Aplicar paginação
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    
    query = query.range(from, to).order('mm_material', { ascending: true })
    
    const { data, error, count } = await query
    
    if (error) {
      console.error('Erro ao buscar inventário:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (error as any).code, 
          message: error.message 
        } 
      }, { status: 500 })
    }
    
    // Processar dados para incluir cálculos
    const processedData = data?.map((item: any) => {
      const available = (item.on_hand_qty || 0) - (item.reserved_qty || 0)
      const unitCost = item.ultimo_unit_cost_cents_por_material || 0
      const totalCents = available * unitCost
      
      return {
        ...item,
        available_qty: available,
        total_cents: Math.round(totalCents),
        total_brl: Math.round(totalCents / 100)
      }
    }) || []
    
    return NextResponse.json({ 
      ok: true, 
      data: processedData,
      pagination: {
        page,
        pageSize,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize)
      }
    })
    
  } catch (error) {
    console.error('Erro inesperado na API wh/inventory:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}