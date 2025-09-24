import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { revalidatePath } from 'next/cache'

export const runtime = 'nodejs'

export async function GET(
  request: NextRequest,
  { params }: { params: { po_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('mm_purchase_order')
      .select('*')
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)
      .single()

    if (error) {
      console.error('Error fetching purchase order:', error)
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 })
    }

    return NextResponse.json(data)

  } catch (error) {
    console.error('Error fetching purchase order:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { po_id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const { vendor_id, po_date, expected_delivery, notes, total_cents } = body

    const { error } = await supabase
      .from('mm_purchase_order')
      .update({
        vendor_id,
        po_date,
        expected_delivery,
        notes,
        total_cents
      })
      .eq('mm_order', params.po_id)
      .eq('tenant_id', tenantId)

    if (error) {
      console.error('Error updating purchase order:', error)
      return NextResponse.json({ error: 'Erro ao atualizar pedido' }, { status: 500 })
    }

    revalidatePath('/mm/purchases')
    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Error updating purchase order:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
