import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const tenantId = 'LaplataLunaria'

    // Tentar criar pedido sem so_id (deixar o trigger gerar)
    const testOrder = {
      tenant_id: tenantId,
      customer_id: 'CUST-1758564216650',
      order_date: '2025-01-23',
      total_cents: 10000,
      total_final_cents: 10000,
      total_negotiated_cents: 9500,
      payment_method: 'PIX',
      payment_term: 'À Vista',
      notes: 'Teste de trigger',
      status: 'draft'
      // so_id não especificado - trigger deve gerar
    }

    console.log('Tentando criar pedido sem so_id:', testOrder)

    const { data: orderData, error: orderError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select()
      .single()

    if (orderError) {
      return NextResponse.json({
        success: false,
        error: 'Erro ao criar pedido sem so_id',
        details: orderError.message,
        code: orderError.code,
        hint: orderError.hint
      })
    }

    // Limpar dados de teste
    await supabase
      .from('sd_sales_order')
      .delete()
      .eq('so_id', orderData.so_id)

    return NextResponse.json({
      success: true,
      message: 'Criação sem so_id funcionou',
      orderData
    })

  } catch (error) {
    console.error('Erro no teste:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
