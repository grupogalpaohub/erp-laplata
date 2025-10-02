import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // Tenant fixo conforme guardrails
    const TENANT_ID = "LaplataLunaria"
    
    // 1. Total de itens com estoque > 0
    const { data: totalItemsData, error: totalItemsError } = await supabase
      .from('wh_inventory')
      .select('*', { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
      .gt('on_hand_qty', 0)
    
    if (totalItemsError) {
      console.error('Erro ao buscar total de itens:', totalItemsError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (totalItemsError as any).code, 
          message: totalItemsError.message 
        } 
      }, { status: 500 })
    }
    
    // 2. Calcular valor total do estoque
    // Buscar inventário com dados de custo
    const { data: inventoryData, error: inventoryError } = await supabase
      .from('wh_inventory')
      .select(`
        mm_material,
        on_hand_qty,
        reserved_qty,
        ultimo_unit_cost_cents_por_material
      `)
      .eq('tenant_id', TENANT_ID)
      .gt('on_hand_qty', 0)
    
    if (inventoryError) {
      console.error('Erro ao buscar dados de inventário:', inventoryError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (inventoryError as any).code, 
          message: inventoryError.message 
        } 
      }, { status: 500 })
    }
    
    // Calcular valor total
    let totalValue = 0
    if (inventoryData) {
      totalValue = inventoryData.reduce((sum: number, item: any) => {
        const available = (item.on_hand_qty || 0) - (item.reserved_qty || 0)
        const unitCost = item.ultimo_unit_cost_cents_por_material || 0
        return sum + (available * unitCost)
      }, 0)
    }
    
    // 3. Buscar dados adicionais para contexto
    const { data: warehouseData, error: warehouseError } = await supabase
      .from('wh_warehouse')
      .select('warehouse_id, warehouse_name')
      .eq('tenant_id', TENANT_ID)
    
    if (warehouseError) {
      console.error('Erro ao buscar dados de warehouse:', warehouseError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (warehouseError as any).code, 
          message: warehouseError.message 
        } 
      }, { status: 500 })
    }
    
    const summary = {
      total_items: totalItemsData?.length || 0,
      total_value_cents: Math.round(totalValue),
      total_value_brl: Math.round(totalValue / 100),
      warehouses: warehouseData?.length || 0,
      last_updated: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      ok: true, 
      data: summary
    })
    
  } catch (error) {
    console.error('Erro inesperado na API wh/summary:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}