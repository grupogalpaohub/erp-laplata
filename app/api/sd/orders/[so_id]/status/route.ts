import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { so_id: string } }
) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const { so_id } = params

    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json(
        { error: 'Status é obrigatório' },
        { status: 400 }
      )
    }

    // Validar status permitidos (conforme enum order_status no Supabase)
    const allowedStatuses = ['draft', 'approved', 'invoiced', 'cancelled']
    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { error: 'Status inválido' },
        { status: 400 }
      )
    }

    // Atualizar status do pedido
    const { data, error } = await supabase
      .from('sd_sales_order')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .select()
      .single()

    if (error) {
      console.error('Error updating order status:', error)
      return NextResponse.json(
        { error: `Erro ao atualizar status: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      order: data,
      message: `Status alterado para ${status}`
    })

  } catch (error) {
    console.error('Error in status update:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
