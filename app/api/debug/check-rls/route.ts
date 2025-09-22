import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    console.log('Checking RLS for tenant:', tenantId)

    // Verificar políticas RLS
    const { data: policies, error: policiesError } = await supabase
      .rpc('get_rls_policies', { table_name: 'sd_sales_order' })

    if (policiesError) {
      console.error('RLS policies error:', policiesError)
    }

    // Verificar se consegue inserir um pedido de teste
    const testOrder = {
      so_id: 'TEST-RLS-' + Date.now(),
      tenant_id: tenantId,
      customer_id: 'CUST-1758564216650', // Cliente existente
      order_date: '2025-09-22',
      total_cents: 10000,
      status: 'draft'
    }

    const { data: insertData, error: insertError } = await supabase
      .from('sd_sales_order')
      .insert(testOrder)
      .select()

    if (insertError) {
      console.error('Insert test error:', insertError)
    } else {
      console.log('Insert test success:', insertData)
      
      // Limpar teste
      await supabase
        .from('sd_sales_order')
        .delete()
        .eq('so_id', testOrder.so_id)
    }

    // Verificar cliente
    const { data: customer, error: customerError } = await supabase
      .from('crm_customer')
      .select('customer_id, name')
      .eq('tenant_id', tenantId)
      .limit(1)

    if (customerError) {
      console.error('Customer check error:', customerError)
    }

    // Verificar materiais
    const { data: materials, error: materialsError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial')
      .eq('tenant_id', tenantId)
      .limit(1)

    if (materialsError) {
      console.error('Materials check error:', materialsError)
    }

    return NextResponse.json({
      success: true,
      tenantId,
      policies: policies || [],
      insertTest: insertError ? { error: insertError.message } : { success: true },
      customer: customer || [],
      materials: materials || [],
      errors: {
        policies: policiesError?.message,
        insert: insertError?.message,
        customer: customerError?.message,
        materials: materialsError?.message
      }
    })

  } catch (error) {
    console.error('Debug RLS error:', error)
    return NextResponse.json(
      { error: 'Debug RLS error', details: error },
      { status: 500 }
    )
  }
}
