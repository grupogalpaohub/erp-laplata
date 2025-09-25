import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()
    const recvId = params.id

    // Buscar o recebimento
    const { data: receiving, error: fetchError } = await supabase
      .from('mm_receiving')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('recv_id', recvId)
      .single()

    if (fetchError || !receiving) {
      return NextResponse.json(
        { error: 'Recebimento não encontrado' },
        { status: 404 }
      )
    }

    // Atualizar status para 'received' (dispara trigger)
    const { error: updateError } = await supabase
      .from('mm_receiving')
      .update({ 
        status: 'received',
        received_at: new Date().toISOString()
      })
      .eq('tenant_id', tenantId)
      .eq('recv_id', recvId)

    if (updateError) {
      return NextResponse.json(
        { error: 'Erro ao atualizar status: ' + updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Recebimento confirmado e estoque atualizado',
      recv_id: recvId
    })

  } catch (error: any) {
    console.error('Error completing receiving:', error)
    return NextResponse.json(
      { error: 'Erro interno: ' + error.message },
      { status: 500 }
    )
  }
}
