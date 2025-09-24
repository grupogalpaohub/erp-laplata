import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { changes } = await request.json()
    
    if (!changes || !Array.isArray(changes)) {
      return NextResponse.json({ error: 'Lista de alterações é obrigatória' }, { status: 400 })
    }

    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    let updated = 0
    const errors: string[] = []

    for (const change of changes) {
      try {
        const { mm_material, changes: materialChanges } = change
        
        // Preparar dados para atualização
        const updateData: any = {}
        Object.keys(materialChanges).forEach(field => {
          updateData[field] = materialChanges[field].new
        })

        // Converter preços se necessário
        if (updateData.mm_price_cents !== undefined) {
          updateData.mm_price_cents = Math.round(Number(updateData.mm_price_cents))
        }
        if (updateData.purchase_price_cents !== undefined) {
          updateData.purchase_price_cents = Math.round(Number(updateData.purchase_price_cents))
        }

        const { error } = await supabase
          .from('mm_material')
          .update(updateData)
          .eq('mm_material', mm_material)
          .eq('tenant_id', tenantId)

        if (error) {
          errors.push(`Erro ao atualizar ${mm_material}: ${error.message}`)
        } else {
          updated++
        }
      } catch (error) {
        errors.push(`Erro ao processar ${change.mm_material}: ${error instanceof Error ? error.message : 'Erro desconhecido'}`)
      }
    }

    if (errors.length > 0) {
      return NextResponse.json({ 
        success: false, 
        error: errors.join('; '),
        updated,
        errors: errors.length
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      updated,
      message: `${updated} materiais atualizados com sucesso`
    })

  } catch (error) {
    console.error('Error updating materials:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}
