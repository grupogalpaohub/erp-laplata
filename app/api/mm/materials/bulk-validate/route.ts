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

    // Validar materiais usando a função SQL
    const { data: validationResults, error } = await supabase
      .rpc('validate_bulk_materials', { materials })

    if (error) {
      console.error('Erro na validação:', error)
      return NextResponse.json(
        { error: 'Erro na validação dos materiais' },
        { status: 500 }
      )
    }

    const validMaterials = validationResults.filter((r: any) => r.is_valid)
    const invalidMaterials = validationResults.filter((r: any) => !r.is_valid)

    return NextResponse.json({
      total: materials.length,
      valid: validMaterials.length,
      invalid: invalidMaterials.length,
      validationResults,
      summary: {
        canProceed: invalidMaterials.length === 0,
        message: invalidMaterials.length === 0 
          ? `Todos os ${validMaterials.length} materiais são válidos`
          : `${invalidMaterials.length} materiais inválidos encontrados`
      }
    })

  } catch (error) {
    console.error('Erro na API de validação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
