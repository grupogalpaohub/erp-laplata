export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/src/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseServer()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { name, contact_email, contact_phone, document_id, customer_type } = body

    // Validar dados obrigatórios
    if (!name || !contact_email || !document_id) {
      return NextResponse.json(
        { error: 'Nome, e-mail e documento são obrigatórios' },
        { status: 400 }
      )
    }

    // Criar cliente
    const { data, error } = await supabase
      .from('crm_customer')
      .insert({
        tenant_id: tenantId,
        name,
        contact_email,
        contact_phone: contact_phone || null,
        document_id,
        customer_type: customer_type || 'PF',
        is_active: true,
        created_date: new Date().toISOString()
      })
      .select('customer_id')
      .single()

    if (error) {
      console.error('Error creating customer:', error)
      return NextResponse.json(
        { error: 'Erro ao criar cliente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      customerId: data.customer_id
    })

  } catch (error) {
    console.error('Error in customer creation API:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
