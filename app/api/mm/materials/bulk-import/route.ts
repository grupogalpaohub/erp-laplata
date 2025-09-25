import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export async function POST(request: NextRequest) {
  try {
    const { materials } = await request.json()
    
    if (!materials || !Array.isArray(materials)) {
      return NextResponse.json({ error: 'Lista de materiais é obrigatória' }, { status: 400 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const results = []
    
    for (const material of materials) {
      try {
        // Se tem ID, é atualização; senão, é criação
        if (material.mm_material?.trim()) {
          // Atualização
          const { data, error } = await supabase
            .from('mm_material')
            .update({
              mm_comercial: material.mm_comercial?.trim() || null,
              mm_desc: material.mm_desc.trim(),
              mm_mat_type: material.mm_mat_type.trim(),
              mm_mat_class: material.mm_mat_class.trim(),
              mm_vendor_id: material.mm_vendor_id.trim(),
              mm_price_cents: Math.round(Number(material.mm_price_cents)),
              mm_purchase_price_cents: Math.round(Number(material.mm_purchase_price_cents)),
              mm_pur_link: material.mm_pur_link?.trim() || null,
              lead_time_days: Number(material.lead_time_days),
              status: material.status || 'active'
            })
            .eq('mm_material', material.mm_material)
            .eq('tenant_id', tenantId)
            .select('mm_material')
            .single()

          if (error) {
            console.error('Erro ao atualizar material:', error)
            results.push({ 
              mm_material: material.mm_material, 
              success: false, 
              error: error.message 
            })
          } else {
            results.push({ 
              mm_material: data.mm_material, 
              success: true, 
              action: 'updated' 
            })
          }
        } else {
          // Criação - gerar ID baseado no tipo
          const typePrefix = material.mm_mat_type?.charAt(0).toUpperCase() || 'M'
          const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
          const generatedId = `${typePrefix}_${randomNum}`

          const { data, error } = await supabase
            .from('mm_material')
            .insert({
              tenant_id: tenantId,
              mm_material: generatedId,
              mm_comercial: material.mm_comercial?.trim() || null,
              mm_desc: material.mm_desc.trim(),
              mm_mat_type: material.mm_mat_type.trim(),
              mm_mat_class: material.mm_mat_class.trim(),
              mm_vendor_id: material.mm_vendor_id.trim(),
              mm_price_cents: Math.round(Number(material.mm_price_cents)),
              mm_purchase_price_cents: Math.round(Number(material.mm_purchase_price_cents)),
              mm_pur_link: material.mm_pur_link?.trim() || null,
              lead_time_days: Number(material.lead_time_days),
              status: material.status || 'active'
            })
            .select('mm_material')
            .single()

          if (error) {
            console.error('Erro ao criar material:', error)
            results.push({ 
              mm_material: generatedId, 
              success: false, 
              error: error.message 
            })
          } else {
            results.push({ 
              mm_material: data.mm_material, 
              success: true, 
              action: 'created' 
            })
          }
        }
      } catch (error) {
        console.error('Erro no processamento do material:', error)
        results.push({ 
          mm_material: material.mm_material || 'unknown', 
          success: false, 
          error: error instanceof Error ? error.message : 'Erro desconhecido' 
        })
      }
    }

    const successCount = results.filter(r => r.success).length
    const errorCount = results.filter(r => !r.success).length

    revalidatePath('/mm/materials')
    return NextResponse.json({
      success: true,
      imported: successCount,
      errors: errorCount,
      results: results
    })

  } catch (error) {
    console.error('Error importing materials:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

