import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export async function PUT(
  request: NextRequest,
  { params }: { params: { customer_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()
    const { customer_id } = params
    
    const body = await request.json()
    const {
      name,
      contact_email,
      contact_phone,
      document_id,
      customer_type,
      address,
      city,
      state,
      zip_code,
      country
    } = body

    // Validar dados obrigatórios
    if (!name || !contact_email || !document_id) {
      return NextResponse.json(
        { error: 'Nome, e-mail e documento são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar cliente
    const { data: customer, error: customerError } = await supabase
      .from('crm_customer')
      .update({
        name,
        contact_email,
        contact_phone,
        document_id,
        customer_type,
        address,
        city,
        state,
        zip_code,
        country,
        updated_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('customer_id', customer_id)
      .select()
      .single()

    if (customerError) {
      console.error('Error updating customer:', customerError)
      return NextResponse.json(
        { error: 'Erro ao atualizar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customer,
      message: 'Cliente atualizado com sucesso'
    })

  } catch (error) {
    console.error('Error updating customer:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { customer_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()
    const { customer_id } = params

    // Verificar se o cliente tem pedidos associados
    const { data: orders, error: ordersError } = await supabase
      .from('sd_sales_order')
      .select('so_id')
      .eq('tenant_id', tenantId)
      .eq('customer_id', customer_id)
      .limit(1)

    if (ordersError) {
      console.error('Error checking orders:', ordersError)
      return NextResponse.json(
        { error: 'Erro ao verificar pedidos do cliente' },
        { status: 500 }
      )
    }

    if (orders && orders.length > 0) {
      return NextResponse.json(
        { error: 'Não é possível excluir cliente com pedidos associados' },
        { status: 400 }
      )
    }

    // Excluir cliente
    const { error: deleteError } = await supabase
      .from('crm_customer')
      .delete()
      .eq('tenant_id', tenantId)
      .eq('customer_id', customer_id)

    if (deleteError) {
      console.error('Error deleting customer:', deleteError)
      return NextResponse.json(
        { error: 'Erro ao excluir cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Cliente excluído com sucesso'
    })

  } catch (error) {
    console.error('Error deleting customer:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
