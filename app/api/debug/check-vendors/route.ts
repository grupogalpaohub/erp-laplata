import { createSupabaseServerClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    
    // Verificar se há fornecedores no banco
    const { data: vendors, error: vendorError } = await supabase
      .from('mm_vendor')
      .select('*')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(5)
    
    // Verificar se há materiais
    const { data: materials, error: materialError } = await supabase
      .from('mm_material')
      .select('mm_material, mm_comercial, mm_vendor_id')
      .eq('tenant_id', 'LaplataLunaria')
      .limit(5)
    
    return Response.json({
      success: true,
      vendors: vendors || [],
      vendorError: vendorError?.message,
      materials: materials || [],
      materialError: materialError?.message,
      debug: {
        vendorCount: vendors?.length || 0,
        materialCount: materials?.length || 0,
        tenantId: 'LaplataLunaria'
      }
    })
  } catch (error) {
    console.error('Debug check-vendors error:', error)
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
