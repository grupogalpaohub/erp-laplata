import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

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

    // Buscar fornecedores válidos
    const { data: vendors } = await supabase
      .from('mm_vendor')
      .select('vendor_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')

    const validVendors = vendors?.map(v => v.vendor_id) || []

    // Tipos e classificações válidos (hardcoded por enquanto)
    const validTypes = ['Brinco', 'Cordão', 'Choker', 'Gargantilha', 'Anel', 'Pulseira', 'Kit']
    const validClassifications = ['Elementar', 'Amuleto', 'Amuletos', 'Protetor', 'Decoração', 'Ciclos', 'Ancestral']

    const validationResults = materials.map((material, index) => {
      const errors: string[] = []

      // Validar campos obrigatórios
      if (!material.mm_comercial?.trim()) {
        errors.push('Nome comercial é obrigatório')
      }
      if (!material.mm_desc?.trim()) {
        errors.push('Descrição é obrigatória')
      }
      if (!material.mm_mat_type?.trim()) {
        errors.push('Tipo de material é obrigatório')
      }
      if (!material.mm_mat_class?.trim()) {
        errors.push('Classificação é obrigatória')
      }
      if (!material.mm_vendor_id?.trim()) {
        errors.push('Fornecedor é obrigatório')
      }
      if (!material.mm_price_cents || material.mm_price_cents <= 0) {
        errors.push('Preço de venda deve ser maior que zero')
      }
      if (!material.mm_purchase_price_cents || material.mm_purchase_price_cents <= 0) {
        errors.push('Preço de compra deve ser maior que zero')
      }
      if (!material.lead_time_days || material.lead_time_days < 0) {
        errors.push('Lead time deve ser maior ou igual a zero')
      }

      // Validar valores específicos
      if (material.mm_mat_type && !validTypes.includes(material.mm_mat_type)) {
        errors.push(`Tipo de material inválido. Use: ${validTypes.join(', ')}`)
      }
      if (material.mm_mat_class && !validClassifications.includes(material.mm_mat_class)) {
        errors.push(`Classificação inválida. Use: ${validClassifications.join(', ')}`)
      }
      if (material.mm_vendor_id && !validVendors.includes(material.mm_vendor_id)) {
        errors.push('Fornecedor não encontrado ou inativo')
      }

      // Gerar ID se não fornecido
      let generatedId = null
      if (!material.mm_material?.trim()) {
        const typePrefix = material.mm_mat_type?.charAt(0).toUpperCase() || 'M'
        const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
        generatedId = `${typePrefix}_${randomNum}`
      }

      return {
        row_index: index,
        is_valid: errors.length === 0,
        error_message: errors.length > 0 ? errors.join('; ') : null,
        generated_id: generatedId
      }
    })

    return NextResponse.json({ results: validationResults })

  } catch (error) {
    console.error('Erro na validação:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

