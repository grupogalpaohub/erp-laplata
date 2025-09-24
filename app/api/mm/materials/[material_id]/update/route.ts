import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { toCents, formatBRL } from '@/lib/money'
import { revalidatePath } from 'next/cache'

export async function PUT(
  request: NextRequest,
  { params }: { params: { material_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const {
      mm_comercial,
      mm_desc,
      mm_mat_type,
      mm_mat_class,
      mm_price_cents,
      mm_purchase_price_cents,
      mm_vendor_id,
      lead_time_days,
      mm_pur_link,
      status,
      commercial_name
    } = body

    // Validar campos obrigatórios
    if (!mm_desc) {
      return NextResponse.json({ 
        success: false, 
        error: 'Descrição é obrigatória' 
      }, { status: 400 })
    }

    // Preparar dados para atualização
    const updateData: any = {
      mm_comercial: mm_comercial || null,
      mm_desc,
      mm_mat_type: mm_mat_type || null,
      mm_mat_class: mm_mat_class || null,
      mm_vendor_id: mm_vendor_id || null,
      lead_time_days: lead_time_days || null,
      mm_pur_link: mm_pur_link || null,
      status: status || 'active',
      commercial_name: commercial_name || null,
      updated_at: new Date().toISOString()
    }

    // Adicionar preços se fornecidos
    if (mm_price_cents !== undefined && mm_price_cents !== null) {
      updateData.mm_price_cents = toCents(mm_price_cents)
    }

    if (mm_purchase_price_cents !== undefined && mm_purchase_price_cents !== null) {
      updateData.mm_purchase_price_cents = toCents(mm_purchase_price_cents)
    }

    const { data, error } = await supabase
      .from('mm_material')
      .update(updateData)
      .eq('mm_material', params.material_id)
      .eq('tenant_id', tenantId)
      .select('mm_material')
      .single()

    if (error) {
      console.error('Error updating material:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    if (!data) {
      return NextResponse.json({ 
        success: false, 
        error: 'Material não encontrado' 
      }, { status: 404 })
    }

    revalidatePath('/mm/materials')
    return NextResponse.json({ 
      success: true, 
      material_id: data.mm_material 
    })

  } catch (error) {
    console.error('Error updating material:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
