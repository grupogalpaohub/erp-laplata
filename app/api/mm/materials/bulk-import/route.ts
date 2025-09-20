export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { materials } = await req.json()

    if (!materials || !Array.isArray(materials)) {
      return NextResponse.json(
        { error: 'Lista de materiais é obrigatória' },
        { status: 400 }
      )
    }

    // Primeiro validar todos os materiais
    const { data: validationResults, error: validationError } = await supabase
      .rpc('validate_bulk_materials', { materials })

    if (validationError) {
      console.error('Erro na validação:', validationError)
      return NextResponse.json(
        { error: 'Erro na validação dos materiais' },
        { status: 500 }
      )
    }

    const validMaterials = validationResults.filter((r: any) => r.is_valid)
    const invalidMaterials = validationResults.filter((r: any) => !r.is_valid)

    if (invalidMaterials.length > 0) {
      return NextResponse.json(
        { 
          error: 'Materiais inválidos encontrados',
          validationResults,
          invalidCount: invalidMaterials.length
        },
        { status: 400 }
      )
    }

    // Preparar dados para inserção (remover mm_material se vazio, será gerado pelo trigger)
    const materialsToInsert = materials.map((material, index) => {
      const validation = validationResults[index]
      return {
        ...material,
        mm_material: validation.generated_id || material.mm_material,
        tenant_id: 'LaplataLunaria', // Usar tenant fixo por enquanto
        status: 'active'
      }
    })

    // Inserir materiais em lote
    const { data: insertedMaterials, error: insertError } = await supabase
      .from('mm_material')
      .insert(materialsToInsert)
      .select('mm_material, mm_comercial, mm_mat_type')

    if (insertError) {
      console.error('Erro na inserção:', insertError)
      return NextResponse.json(
        { error: 'Erro ao inserir materiais' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      inserted: insertedMaterials.length,
      materials: insertedMaterials,
      message: `${insertedMaterials.length} materiais importados com sucesso`
    })

  } catch (error) {
    console.error('Erro na API de importação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
