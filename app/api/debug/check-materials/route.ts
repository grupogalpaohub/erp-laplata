export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    console.log('[debug] Checking materials for tenant:', tenantId)

    // Verificar se há materiais na tabela
    const { data: materials, error: materialsError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_desc, purchase_price_cents, sale_price_cents, mm_vendor_id, tenant_id')
      .eq('tenant_id', tenantId)
      .order('mm_material')

    console.log('[debug] Materials query result:', { materials, materialsError })

    // Verificar se há fornecedores
    const { data: vendors, error: vendorsError } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name, tenant_id')
      .eq('tenant_id', tenantId)
      .order('vendor_name')

    console.log('[debug] Vendors query result:', { vendors, vendorsError })

    // Verificar estrutura da tabela
    const { data: tableInfo, error: tableError } = await supabase
      .from('mm_material')
      .select('*')
      .limit(1)

    console.log('[debug] Table structure sample:', { tableInfo, tableError })

    return NextResponse.json({
      success: true,
      tenantId,
      materialsCount: materials?.length || 0,
      vendorsCount: vendors?.length || 0,
      materials: materials?.slice(0, 5) || [], // Primeiros 5 materiais
      vendors: vendors?.slice(0, 5) || [], // Primeiros 5 fornecedores
      tableSample: tableInfo?.[0] || null,
      errors: {
        materials: materialsError?.message,
        vendors: vendorsError?.message,
        table: tableError?.message
      }
    })
  } catch (error) {
    console.error('[debug] Error checking materials:', error)
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}

