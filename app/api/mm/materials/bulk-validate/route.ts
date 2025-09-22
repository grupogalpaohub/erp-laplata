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

    // Buscar dados de customizing
    const { data: types } = await supabase
      .from('customizing')
      .select('value')
      .eq('tenant_id', tenantId)
      .eq('category', 'material_type')
      .order('value')
    
    const { data: classifications } = await supabase
      .from('customizing')
      .select('value')
      .eq('tenant_id', tenantId)
      .eq('category', 'material_classification')
      .order('value')

    const validTypes = types?.map(t => t.value) || ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira']
    const validClassifications = classifications?.map(c => c.value) || ['Elementar', 'Amuleto', 'Protetor', 'Decoração']

    // Buscar fornecedores válidos
    const { data: vendors } = await supabase
      .from('mm_vendor')
      .select('vendor_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')

    const validVendors = vendors?.map(v => v.vendor_id) || []

    const validationResults = materials.map((material, index) => {
      const errors: string[] = []

      // Validar campos obrigatórios
      if (!material.mm_desc?.trim()) {
        errors.push('Descrição é obrigatória')
      }
      if (!material.mm_mat_type?.trim()) {
        errors.push('Tipo de material é obrigatório')
      } else if (!validTypes.includes(material.mm_mat_type)) {
        errors.push(`Tipo inválido. Use: ${validTypes.join(', ')}`)
      }
      if (!material.mm_mat_class?.trim()) {
        errors.push('Classificação é obrigatória')
      } else if (!validClassifications.includes(material.mm_mat_class)) {
        errors.push(`Classificação inválida. Use: ${validClassifications.join(', ')}`)
      }
      if (!material.mm_vendor_id?.trim()) {
        errors.push('Fornecedor é obrigatório')
      } else if (!validVendors.includes(material.mm_vendor_id)) {
        errors.push('Fornecedor não encontrado')
      }
      if (!material.mm_price_cents || isNaN(Number(material.mm_price_cents))) {
        errors.push('Preço de venda é obrigatório e deve ser numérico')
      }
      if (!material.purchase_price_cents || isNaN(Number(material.purchase_price_cents))) {
        errors.push('Preço de compra é obrigatório e deve ser numérico')
      }
      if (!material.catalog_url?.trim()) {
        errors.push('Link do catálogo é obrigatório')
      } else if (!isValidUrl(material.catalog_url)) {
        errors.push('Link do catálogo deve ser uma URL válida')
      }
      if (!material.lead_time_days || isNaN(Number(material.lead_time_days)) || Number(material.lead_time_days) < 0) {
        errors.push('Lead time deve ser um número maior ou igual a 0')
      }

      return {
        row_index: index,
        is_valid: errors.length === 0,
        error_message: errors.length > 0 ? errors.join('; ') : null,
        generated_id: errors.length === 0 ? generateMaterialId(material.mm_mat_type) : null
      }
    })

    const validCount = validationResults.filter(r => r.is_valid).length
    const invalidCount = validationResults.filter(r => !r.is_valid).length

    return NextResponse.json({
      validationResults,
      summary: {
        total: materials.length,
        valid: validCount,
        invalid: invalidCount,
        canProceed: validCount > 0 && invalidCount === 0
      }
    })

  } catch (error) {
    console.error('Error validating materials:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

function isValidUrl(string: string): boolean {
  try {
    new URL(string)
    return true
  } catch (_) {
    return false
  }
}

function generateMaterialId(type: string): string {
  const prefix = type.charAt(0).toUpperCase()
  const timestamp = Date.now().toString().slice(-6)
  return `${prefix}_${timestamp}`
}