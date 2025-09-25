export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll: () => req.cookies.getAll(),
        },
      }
    )

    // 1. Criar tenant
    const { error: tenantError } = await supabase
      .from('tenant')
      .upsert({
        tenant_id: 'LaplataLunaria',
        display_name: 'La Plata Lunaria',
        locale: 'pt-BR',
        timezone: 'America/Sao_Paulo'
      })

    if (tenantError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao criar tenant: ${tenantError.message}`,
        step: 'tenant'
      }, { status: 500 })
    }

    // 2. Criar fornecedor
    const { error: vendorError } = await supabase
      .from('mm_vendor')
      .upsert({
        tenant_id: 'LaplataLunaria',
        vendor_id: 'SUP_00001',
        vendor_name: 'Silvercrown',
        email: 'sac.silvercrown@gmail.com',
        telefone: '(44) 9184-4337',
        cidade: 'Paranavai',
        estado: 'PR',
        vendor_rating: 'A',
        status: 'active'
      })

    if (vendorError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao criar fornecedor: ${vendorError.message}`,
        step: 'vendor'
      }, { status: 500 })
    }

    // 3. Criar warehouse
    const { error: warehouseError } = await supabase
      .from('wh_warehouse')
      .upsert({
        tenant_id: 'LaplataLunaria',
        plant_id: 'WH-001',
        name: 'Depósito Principal',
        is_default: true
      })

    if (warehouseError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao criar warehouse: ${warehouseError.message}`,
        step: 'warehouse'
      }, { status: 500 })
    }

    // 4. Criar alguns materiais de exemplo
    const materials = [
      {
        tenant_id: 'LaplataLunaria',
        mm_material: 'B_175',
        mm_comercial: 'Símbolo',
        mm_desc: 'Brinco Argola Cravejado Trevo Resina Preto Misto',
        mm_mat_type: 'Brinco',
        mm_mat_class: 'Amuletos',
        mm_price_cents: 24453,
        status: 'active',
        mm_vendor_id: 'SUP_00001'
      },
      {
        tenant_id: 'LaplataLunaria',
        mm_material: 'B_176',
        mm_comercial: 'Nauriah',
        mm_desc: 'Brinco Círculo Cravejado Olho Grego de Prata',
        mm_mat_type: 'Brinco',
        mm_mat_class: 'Amuletos',
        mm_price_cents: 19653,
        status: 'active',
        mm_vendor_id: 'SUP_00001'
      },
      {
        tenant_id: 'LaplataLunaria',
        mm_material: 'G_200',
        mm_comercial: 'Vitalis',
        mm_desc: 'Gargantilha Árvore da Vida Zircônia Verde - P',
        mm_mat_type: 'Gargantilha',
        mm_mat_class: 'Ancestral',
        mm_price_cents: 28453,
        status: 'active',
        mm_vendor_id: 'SUP_00001'
      }
    ]

    const { error: materialsError } = await supabase
      .from('mm_material')
      .upsert(materials)

    if (materialsError) {
      return NextResponse.json({
        success: false,
        error: `Erro ao criar materiais: ${materialsError.message}`,
        step: 'materials'
      }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Dados iniciais carregados com sucesso!',
      data: {
        tenant: 'LaplataLunaria',
        vendor: 'SUP_00001 - Silvercrown',
        warehouse: 'WH-001 - Depósito Principal',
        materials: materials.length
      }
    })

  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      step: 'exception'
    }, { status: 500 })
  }
}

