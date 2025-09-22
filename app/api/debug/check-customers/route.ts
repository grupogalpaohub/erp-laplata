import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    console.log('Checking customers for tenant:', tenantId)
    
    // Verificar clientes
    const { data: customers, error: customersError } = await supabase
      .from('crm_customer')
      .select(`
        customer_id,
        name,
        contact_email,
        contact_phone,
        customer_type,
        is_active,
        created_date
      `)
      .eq('tenant_id', tenantId)
      .order('name')
    
    if (customersError) {
      console.error('Customers error:', customersError)
      return NextResponse.json({
        success: false,
        error: customersError.message,
        details: customersError
      })
    }
    
    // Verificar apenas clientes ativos
    const activeCustomers = customers?.filter(c => c.is_active === true) || []
    
    return NextResponse.json({
      success: true,
      tenantId,
      customers: customers || [],
      activeCustomers: activeCustomers,
      totalCount: customers?.length || 0,
      activeCount: activeCustomers.length,
      errors: {
        customers: customersError?.message
      }
    })
    
  } catch (error) {
    console.error('Debug customers error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}
