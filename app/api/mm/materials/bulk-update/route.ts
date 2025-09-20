export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'

interface MaterialChange {
  mm_material: string
  changes: Record<string, { old: any, new: any }>
}

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { changes }: { changes: MaterialChange[] } = await req.json()

    if (!changes || !Array.isArray(changes)) {
      return NextResponse.json(
        { error: 'Lista de mudanças é obrigatória' },
        { status: 400 }
      )
    }

    const results = []
    const errors = []

    // Processar cada material
    for (const materialChange of changes) {
      try {
        const { mm_material, changes: fieldChanges } = materialChange
        
        // Preparar dados para update (remover campos que não devem ser alterados)
        const updateData: any = {}
        Object.keys(fieldChanges).forEach(field => {
          if (field !== 'mm_material') { // mm_material é imutável
            updateData[field] = fieldChanges[field].new
          }
        })

        // Executar update
        const { data, error: updateError } = await supabase
          .from('mm_material')
          .update(updateData)
          .eq('mm_material', mm_material)
          .select('mm_material, mm_comercial')

        if (updateError) {
          errors.push({
            mm_material,
            error: updateError.message
          })
          continue
        }

        // Registrar logs de mudanças
        for (const [field, change] of Object.entries(fieldChanges)) {
          if (field !== 'mm_material' && change.old !== change.new) {
            // Log genérico de mudança
            await supabase
              .from('mm_change_log')
              .insert({
                table_name: 'mm_material',
                record_id: mm_material,
                field_name: field,
                old_value: change.old?.toString() || null,
                new_value: change.new?.toString() || null
              })

            // Se for mudança de preço, registrar no log específico
            if (field === 'mm_price_cents') {
              await supabase
                .from('mm_price_log')
                .insert({
                  mm_material,
                  old_price: change.old,
                  new_price: change.new
                })
            }
          }
        }

        results.push({
          mm_material,
          success: true,
          data: data?.[0]
        })

      } catch (error) {
        errors.push({
          mm_material: materialChange.mm_material,
          error: error instanceof Error ? error.message : 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: errors.length === 0,
      updated: results.length,
      errorCount: errors.length,
      results,
      errors: errors.length > 0 ? errors : undefined
    })

  } catch (error) {
    console.error('Erro na API de atualização em lote:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
