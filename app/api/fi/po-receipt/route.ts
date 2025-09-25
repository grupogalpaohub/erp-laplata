import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { po_id, total_amount_cents } = body

    // Validar dados obrigatórios
    if (!po_id || !total_amount_cents) {
      return NextResponse.json(
        { error: 'PO ID e valor total são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar dados do pedido de compra
    const { data: poData, error: poError } = await supabase
      .from('mm_purchase_order')
      .select('po_id, vendor_id, total_cents')
      .eq('tenant_id', tenantId)
      .eq('po_id', po_id)
      .single()

    if (poError || !poData) {
      return NextResponse.json(
        { error: 'Pedido de compra não encontrado' },
        { status: 404 }
      )
    }

    // Criar lançamento contábil para recebimento de compra
    const entryItems = [
      {
        account_code: '1.1.1.01', // Estoque de Materiais
        debit_cents: total_amount_cents,
        credit_cents: 0,
        description: `Recebimento de compra ${po_id}`
      },
      {
        account_code: '2.1.1.01', // Fornecedores a Pagar
        debit_cents: 0,
        credit_cents: total_amount_cents,
        description: `Obrigação com fornecedor - ${po_id}`
      }
    ]

    const { data: entry, error: entryError } = await supabase
      .from('fi_accounting_entry')
      .insert({
        tenant_id: tenantId,
        entry_date: new Date().toISOString().split('T')[0],
        description: `Recebimento de compra ${po_id}`,
        total_debit_cents: total_amount_cents,
        total_credit_cents: total_amount_cents,
        is_posted: true,
        created_by: 'system'
      })
      .select('entry_id')
      .single()

    if (entryError) {
      console.error('Error creating PO receipt entry:', entryError)
      return NextResponse.json(
        { error: 'Erro ao criar lançamento de recebimento' },
        { status: 500 }
      )
    }

    // Criar itens do lançamento
    const entryItemsData = entryItems.map(item => ({
      entry_id: entry.entry_id,
      tenant_id: tenantId,
      account_code: item.account_code,
      debit_cents: item.debit_cents,
      credit_cents: item.credit_cents,
      description: item.description
    }))

    const { error: itemsError } = await supabase
      .from('fi_accounting_entry_item')
      .insert(entryItemsData)

    if (itemsError) {
      console.error('Error creating entry items:', itemsError)
      return NextResponse.json(
        { error: 'Erro ao criar itens do lançamento' },
        { status: 500 }
      )
    }

    // Criar conta a pagar
    const { error: apError } = await supabase
      .from('fi_accounts_payable')
      .insert({
        tenant_id: tenantId,
        vendor_id: poData.vendor_id,
        po_id: po_id,
        amount_cents: total_amount_cents,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
        status: 'PENDING'
      })

    if (apError) {
      console.warn('Error creating accounts payable:', apError)
      // Não falha a operação por causa da AP
    }

    return NextResponse.json({
      success: true,
      entry_id: entry.entry_id,
      message: 'Lançamento de recebimento criado com sucesso'
    })

  } catch (error) {
    console.error('Error in PO receipt:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

