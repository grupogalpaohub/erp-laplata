import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function GET() {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar tipos de material
    const { data: types } = await supabase
      .from('customizing')
      .select('value')
      .eq('tenant_id', tenantId)
      .eq('category', 'material_type')
      .order('value')
    
    // Buscar classificações de material
    const { data: classifications } = await supabase
      .from('customizing')
      .select('value')
      .eq('tenant_id', tenantId)
      .eq('category', 'material_classification')
      .order('value')

    // Buscar fornecedores
    const { data: vendors } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .order('vendor_name')

    return NextResponse.json({
      success: true,
      data: {
        types: types?.map(t => t.value) || ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira'],
        classifications: classifications?.map(c => c.value) || ['Elementar', 'Amuleto', 'Protetor', 'Decoração'],
        vendors: vendors || []
      }
    })

  } catch (error) {
    console.error('Error fetching customizing data:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
