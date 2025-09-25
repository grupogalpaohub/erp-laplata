import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { toCents, formatBRL } from '@/lib/money'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const formData = await request.formData()
    const mm_mat_type = formData.get('mm_mat_type') as string
    
    // Validar se o tipo é obrigatório
    if (!mm_mat_type) {
      return NextResponse.json({ 
        success: false, 
        error: 'Tipo de material é obrigatório' 
      }, { status: 400 })
    }

    const lead_time_days = formData.get('lead_time_days') as string
    const mm_purchase_price_cents = formData.get('mm_purchase_price_cents') as string
    
    // Validar lead time obrigatório
    if (!lead_time_days || parseInt(lead_time_days) < 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Lead Time é obrigatório e deve ser maior ou igual a 0' 
      }, { status: 400 })
    }
    
    // Validar preço de compra obrigatório
    if (!mm_purchase_price_cents || parseFloat(mm_purchase_price_cents) < 0) {
      return NextResponse.json({ 
        success: false, 
        error: 'Preço de compra é obrigatório e deve ser maior ou igual a 0' 
      }, { status: 400 })
    }

    // Gerar ID do material baseado no tipo
    const generateMaterialId = async (matType: string) => {
      // Pegar primeiro caractere do tipo e converter para maiúsculo
      const prefix = `${matType.charAt(0).toUpperCase()}_`
      
      // Buscar próximo número sequencial para este tipo
      const { data: existingMaterials } = await supabase
        .from('mm_material')
        .select('mm_material')
        .eq('tenant_id', tenantId)
        .like('mm_material', `${prefix}%`)
        .order('mm_material', { ascending: false })
        .limit(1)
      
      let nextNum = 1
      if (existingMaterials && existingMaterials.length > 0) {
        const lastId = existingMaterials[0].mm_material
        const lastNum = parseInt(lastId.substring(prefix.length))
        nextNum = lastNum + 1
      }
      
      return `${prefix}${nextNum.toString().padStart(3, '0')}`
    }

    const materialId = await generateMaterialId(mm_mat_type)

    const materialData = {
      tenant_id: tenantId,
      mm_material: materialId,
      mm_comercial: formData.get('mm_comercial') as string,
      mm_desc: formData.get('mm_desc') as string,
      mm_mat_type: mm_mat_type,
      mm_mat_class: formData.get('mm_mat_class') as string,
      mm_vendor_id: formData.get('mm_vendor_id') as string,
      mm_price_cents: toCents(parseFloat(formData.get('mm_price_cents') as string)),
      mm_purchase_price_cents: toCents(parseFloat(mm_purchase_price_cents)),
      mm_pur_link: formData.get('mm_pur_link') as string,
      lead_time_days: parseInt(lead_time_days),
      status: 'active'
    }

    const { data, error } = await supabase
      .from('mm_material')
      .insert([materialData])
      .select('mm_material')
      .single()

    if (error) {
      console.error('Error creating material:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    revalidatePath('/mm/materials')
    return NextResponse.json({ 
      success: true, 
      material_id: data.mm_material 
    })

  } catch (error) {
    console.error('Error creating material:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

