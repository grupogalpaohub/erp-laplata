import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { 
      lead_time_days = 7, 
      safety_days = 10, 
      analysis_days = 90 
    } = body

    // Buscar vendas dos últimos 90 dias
    const { data: salesData, error: salesError } = await supabase
      .from('sd_sales_order_item')
      .select(`
        mm_material,
        qty_sold,
        unit_price_cents_at_order,
        so:sd_sales_order(created_at, status)
      `)
      .eq('so.tenant_id', tenantId)
      .eq('so.status', 'received')
      .gte('so.created_at', new Date(Date.now() - analysis_days * 24 * 60 * 60 * 1000).toISOString())

    if (salesError) {
      console.error('Error fetching sales data:', salesError)
      return NextResponse.json(
        { error: 'Erro ao buscar dados de vendas' },
        { status: 500 }
      )
    }

    // Buscar estoque atual
    const { data: stockData, error: stockError } = await supabase
      .from('v_wh_stock')
      .select('mm_material, on_hand_qty, reserved_qty, available_qty')
      .eq('tenant_id', tenantId)

    if (stockError) {
      console.error('Error fetching stock data:', stockError)
      return NextResponse.json(
        { error: 'Erro ao buscar dados de estoque' },
        { status: 500 }
      )
    }

    // Processar dados de vendas por material
    const salesByMaterial = salesData?.reduce((acc: any, item: any) => {
      const material = item.mm_material
      if (!acc[material]) {
        acc[material] = {
          total_qty: 0,
          total_value: 0,
          days: new Set()
        }
      }
      acc[material].total_qty += item.qty_sold || 0
      acc[material].total_value += (item.qty_sold || 0) * (item.unit_price_cents_at_order || 0)
      acc[material].days.add(new Date(item.so.created_at).toDateString())
      return acc
    }, {}) || {}

    // Calcular sugestões MRP
    const suggestions = Object.entries(salesByMaterial).map(([material, data]: [string, any]) => {
      const stock = stockData?.find(s => s.mm_material === material)
      const onHandQty = stock?.on_hand_qty || 0
      const availableQty = stock?.available_qty || 0
      const totalQty = data.total_qty
      const daysWithSales = data.days.size
      const avgDaily = daysWithSales > 0 ? totalQty / daysWithSales : 0
      
      // Calcular cobertura necessária
      const targetCoverageDays = lead_time_days + safety_days
      const targetCoverageQty = Math.ceil(avgDaily * targetCoverageDays)
      
      // Calcular sugestão de compra
      const suggestedPurchaseQty = Math.max(0, targetCoverageQty - availableQty)

      return {
        tenant_id: tenantId,
        mm_material: material,
        on_hand_qty: onHandQty,
        reserved_qty: stock?.reserved_qty || 0,
        available_qty: availableQty,
        qty_90d: totalQty,
        avg_daily: avgDaily,
        lead_time_days: lead_time_days,
        safety_days: safety_days,
        target_coverage_qty: targetCoverageQty,
        suggested_purchase_qty: suggestedPurchaseQty
      }
    })

    // Inserir/atualizar sugestões na tabela
    const { error: insertError } = await supabase
      .from('wh_mrp_suggestion')
      .upsert(suggestions, {
        onConflict: 'tenant_id,mm_material'
      })

    if (insertError) {
      console.error('Error inserting MRP suggestions:', insertError)
      return NextResponse.json(
        { error: 'Erro ao salvar sugestões MRP' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      suggestions_count: suggestions.length,
      message: 'Sugestões MRP calculadas com sucesso'
    })

  } catch (error) {
    console.error('Error in MRP calculation:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
