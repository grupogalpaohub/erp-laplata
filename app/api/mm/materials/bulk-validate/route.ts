export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/src/lib/supabase/server'
import { MATERIAL_TYPES, MATERIAL_CLASSIFICATIONS, UNITS_OF_MEASURE } from '@/src/lib/material-config'

export async function POST(req: NextRequest) {
  try {
    const supabase = createClient()
    const { materials } = await req.json()

    console.log('Validação iniciada para', materials?.length || 0, 'materiais')

    if (!materials || !Array.isArray(materials)) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Lista de materiais é obrigatória',
          details: 'O arquivo deve conter uma lista de materiais para validação'
        },
        { status: 400 }
      )
    }

    const validationResults = []
    const errors = []

    for (let i = 0; i < materials.length; i++) {
      const material = materials[i]
      const rowNumber = i + 1
      const materialErrors = []

      console.log(`Validando material ${rowNumber}:`, material)

      // Validar campos obrigatórios
      if (!material.mm_desc) {
        materialErrors.push(`Linha ${rowNumber}: Descrição é obrigatória`)
      }

      if (!material.mm_mat_type) {
        materialErrors.push(`Linha ${rowNumber}: Tipo de material é obrigatório`)
      } else {
        const validTypes = MATERIAL_TYPES.map(t => t.type)
        if (!validTypes.includes(material.mm_mat_type)) {
          materialErrors.push(`Linha ${rowNumber}: Tipo de material '${material.mm_mat_type}' inválido. Valores aceitos: ${validTypes.join(', ')}`)
        }
      }

      if (!material.mm_mat_class) {
        materialErrors.push(`Linha ${rowNumber}: Classificação é obrigatória`)
      } else {
        const validClasses = MATERIAL_CLASSIFICATIONS.map(c => c.classification)
        if (!validClasses.includes(material.mm_mat_class)) {
          materialErrors.push(`Linha ${rowNumber}: Classificação '${material.mm_mat_class}' inválida. Valores aceitos: ${validClasses.join(', ')}`)
        }
      }

      if (!material.mm_vendor_id) {
        materialErrors.push(`Linha ${rowNumber}: Fornecedor é obrigatório`)
      }

      if (!material.purchase_price_cents) {
        materialErrors.push(`Linha ${rowNumber}: Preço de compra é obrigatório`)
      } else if (isNaN(Number(material.purchase_price_cents)) || Number(material.purchase_price_cents) <= 0) {
        materialErrors.push(`Linha ${rowNumber}: Preço de compra deve ser um número positivo`)
      }

      if (!material.sale_price_cents) {
        materialErrors.push(`Linha ${rowNumber}: Preço de venda é obrigatório`)
      } else if (isNaN(Number(material.sale_price_cents)) || Number(material.sale_price_cents) <= 0) {
        materialErrors.push(`Linha ${rowNumber}: Preço de venda deve ser um número positivo`)
      }

      if (!material.lead_time_days) {
        materialErrors.push(`Linha ${rowNumber}: Lead time é obrigatório`)
      } else if (isNaN(Number(material.lead_time_days)) || Number(material.lead_time_days) < 0) {
        materialErrors.push(`Linha ${rowNumber}: Lead time deve ser um número não negativo`)
      }

      const isValid = materialErrors.length === 0
      
      validationResults.push({
        row: rowNumber,
        material: material,
        isValid,
        errors: materialErrors
      })

      if (!isValid) {
        errors.push(...materialErrors)
      }
    }

    const validCount = validationResults.filter(r => r.isValid).length
    const invalidCount = validationResults.filter(r => !r.isValid).length

    console.log(`Validação concluída: ${validCount} válidos, ${invalidCount} inválidos`)

    return NextResponse.json({
      success: true,
      total: materials.length,
      valid: validCount,
      invalid: invalidCount,
      validationResults,
      errors: errors,
      summary: {
        canProceed: invalidCount === 0,
        message: invalidCount === 0 
          ? `✅ Todos os ${validCount} materiais são válidos e podem ser importados`
          : `❌ ${invalidCount} materiais inválidos encontrados. Corrija os erros antes de importar.`
      }
    })

  } catch (error) {
    console.error('Erro na API de validação:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Erro interno do servidor',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}
