import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''
    
    const { data, error } = await supabase
      .from('crm_customer')
      .select('customer_id, name, contact_email, contact_phone, document_id, customer_type, is_active')
      .eq('tenant_id', tenantId)
      .ilike('name', `%${q}%`)
      .order('name')
      .limit(50)

    if (error) {
      console.error('Error fetching customers:', error)
      return NextResponse.json({ 
        success: false, 
        error: 'Erro ao buscar clientes' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      data: data || [] 
    })

  } catch (error) {
    console.error('Error in customers GET:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()
    
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

    // Gerar ID sequencial do cliente
    const { data: lastCustomer } = await supabase
      .from('crm_customer')
      .select('customer_id')
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(1)

    const lastCustomerNumber = lastCustomer?.[0]?.customer_id || 'C2025-000'
    const nextNumber = parseInt(lastCustomerNumber.split('-')[1]) + 1
    const newCustomerId = `C2025-${nextNumber.toString().padStart(3, '0')}`

    // Criar cliente
    const { data: customer, error: customerError } = await supabase
      .from('crm_customer')
      .insert({
        customer_id: newCustomerId,
        tenant_id: tenantId,
        name,
        contact_email,
        contact_phone: contact_phone || null,
        document_id,
        customer_type: customer_type || 'PF',
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zip_code || null,
        country: country || 'Brasil',
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single()

    if (customerError) {
      console.error('Error creating customer:', customerError)
      return NextResponse.json(
        { error: 'Erro ao criar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Cliente criado com sucesso'
    })

  } catch (error) {
    console.error('Error in customer creation:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const {
      customer_id,
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
    if (!customer_id || !name || !contact_email || !document_id) {
      return NextResponse.json(
        { success: false, error: 'ID do cliente, nome, e-mail e documento são obrigatórios' },
        { status: 400 }
      )
    }

    // Atualizar cliente
    const { data: customer, error: customerError } = await supabase
      .from('crm_customer')
      .update({
        name,
        contact_email,
        contact_phone: contact_phone || null,
        document_id,
        customer_type: customer_type || 'PF',
        address: address || null,
        city: city || null,
        state: state || null,
        zip_code: zip_code || null,
        country: country || 'Brasil',
        updated_at: new Date().toISOString()
      })
      .eq('customer_id', customer_id)
      .eq('tenant_id', tenantId)
      .select()
      .single()

    if (customerError) {
      console.error('Error updating customer:', customerError)
      return NextResponse.json(
        { success: false, error: 'Erro ao atualizar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Cliente atualizado com sucesso'
    })

  } catch (error) {
    console.error('Error in customer update:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

