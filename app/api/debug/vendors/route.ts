import { createSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    console.log('Debug vendors - tenantId:', tenantId)
    
    const { data: vendors, error: vendorError } = await supabase
      .from('mm_vendor')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('vendor_name')
    
    console.log('Debug vendors - result:', { vendors, vendorError })
    
    const { data: materials, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_vendor_id')
      .eq('tenant_id', tenantId)
      .limit(5)
    
    return Response.json({
      success: true,
      tenantId,
      vendors: vendors || [],
      vendorError: vendorError?.message,
      materials: materials || [],
      materialError: materialError?.message,
      debug: {
        vendorCount: vendors?.length || 0,
        materialCount: materials?.length || 0
      }
    })
  } catch (error) {
    console.error('Debug vendors error:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
