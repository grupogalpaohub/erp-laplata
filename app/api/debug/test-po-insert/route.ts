import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Teste 1: Inserir item simples sem triggers
    const testItem = {
      tenant_id: tenantId,
      mm_order: 'PO-TEST-001',
      plant_id: 'WH-001',
      mm_material: 'B_175',
      mm_qtt: 1,
      unit_cost_cents: 10000,
      line_total_cents: 10000,
      currency: 'BRL',
      po_item_id: 1
    }

    console.log('Testando inserção de item:', testItem)

    const { data, error } = await supabase
      .from('mm_purchase_order_item')
      .insert(testItem)
      .select()

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        details: error,
        testItem
      })
    }

    return NextResponse.json({
      success: true,
      data,
      testItem
    })

  } catch (error) {
    console.error('Error in test:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
