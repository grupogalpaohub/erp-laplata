import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'
import { toCents, formatBRL } from '@/lib/money'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const formData = await request.formData()
    const mm_material = formData.get('mm_material') as string
    const mm_comercial = formData.get('mm_comercial') as string
    const mm_desc = formData.get('mm_desc') as string
    const mm_mat_type = formData.get('mm_mat_type') as string
    const mm_mat_class = formData.get('mm_mat_class') as string
    const mm_price_cents = formData.get('mm_price_cents') as string
    const mm_purchase_price_cents = formData.get('mm_purchase_price_cents') as string
    const mm_pur_link = formData.get('mm_pur_link') as string
    const commercial_name = formData.get('commercial_name') as string
    const lead_time_days = formData.get('lead_time_days') as string
    const mm_vendor_id = formData.get('mm_vendor_id') as string
    const status = formData.get('status') as string

    if (!mm_material || !mm_desc) {
      return NextResponse.json({ error: 'SKU e descrição são obrigatórios' }, { status: 400 })
    }

    // Converter preços para centavos
    const priceCents = mm_price_cents ? toCents(mm_price_cents) : null
    const purchasePriceCents = mm_purchase_price_cents ? toCents(mm_purchase_price_cents) : null

    // Preparar dados para atualização
    const updateData: any = {
      mm_comercial: mm_comercial || null,
      mm_desc: mm_desc,
      mm_mat_type: mm_mat_type || null,
      mm_mat_class: mm_mat_class || null,
      mm_price_cents: priceCents,
      mm_purchase_price_cents: purchasePriceCents,
      mm_pur_link: mm_pur_link || null,
      commercial_name: commercial_name || null,
      lead_time_days: lead_time_days ? parseInt(lead_time_days) : null,
      mm_vendor_id: mm_vendor_id || null,
      status: status || 'active'
    }

    // Atualizar material
    const { data, error } = await supabase
      .from('mm_material')
      .update(updateData)
      .eq('mm_material', mm_material)
      .eq('tenant_id', tenantId)
      .select('mm_material')
      .single()

    if (error) {
      console.error('Erro ao atualizar material:', error)
      return NextResponse.json({ error: 'Erro ao atualizar material' }, { status: 500 })
    }

    revalidatePath('/mm/materials')
    // Redirecionar para o catálogo com mensagem de sucesso
    return NextResponse.redirect(new URL('/mm/catalog?success=Material atualizado com sucesso', request.url))

  } catch (error) {
    console.error('Erro na API de atualização de material:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

