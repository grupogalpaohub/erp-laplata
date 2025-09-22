import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { materials } = await request.json()
    
    if (!materials || !Array.isArray(materials)) {
      return NextResponse.json({ error: 'Lista de materiais é obrigatória' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Preparar dados para inserção
    const materialsToInsert = materials.map(material => ({
      tenant_id: tenantId,
      mm_material: generateMaterialId(material.mm_mat_type),
      mm_comercial: material.mm_comercial?.trim() || null,
      mm_desc: material.mm_desc.trim(),
      mm_mat_type: material.mm_mat_type.trim(),
      mm_mat_class: material.mm_mat_class.trim(),
      mm_vendor_id: material.mm_vendor_id.trim(),
      mm_price_cents: Math.round(Number(material.mm_price_cents) * 100), // Convert to cents
      lead_time_days: Number(material.lead_time_days),
      status: 'active'
    }))

    // Inserir materiais
    const { data, error } = await supabase
      .from('mm_material')
      .insert(materialsToInsert)
      .select('mm_material')

    if (error) {
      console.error('Error inserting materials:', error)
      return NextResponse.json({ error: 'Erro ao inserir materiais: ' + error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      imported: data.length,
      materials: data.map(m => m.mm_material)
    })

  } catch (error) {
    console.error('Error importing materials:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

function generateMaterialId(type: string): string {
  const prefix = type.charAt(0).toUpperCase()
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}_${timestamp}`
}