import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    console.log('Checking materials for tenant:', tenantId)
    
    // Verificar materiais
    const { data: materials, error: materialsError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, mm_price_cents, status')
      .eq('tenant_id', tenantId)
      .limit(10)
    
    if (materialsError) {
      console.error('Materials error:', materialsError)
      return NextResponse.json({
        success: false,
        error: materialsError.message,
        details: materialsError
      })
    }
    
    // Verificar clientes
    const { data: customers, error: customersError } = await supabase
      .from('crm_customer')
      .select('customer_id, name, contact_email, is_active')
      .eq('tenant_id', tenantId)
      .limit(5)
    
    if (customersError) {
      console.error('Customers error:', customersError)
    }
    
    return NextResponse.json({
      success: true,
      tenantId,
      materials: materials || [],
      customers: customers || [],
      materialsCount: materials?.length || 0,
      customersCount: customers?.length || 0,
      errors: {
        materials: materialsError?.message,
        customers: customersError?.message
      }
    })
    
  } catch (error) {
    console.error('Debug materials error:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', details: error },
      { status: 500 }
    )
  }
}
