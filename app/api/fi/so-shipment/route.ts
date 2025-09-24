import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { so_id, revenue_cents, cogs_cents } = body

    // Validar dados obrigatórios
    if (!so_id || !revenue_cents || !cogs_cents) {
      return NextResponse.json(
        { error: 'SO ID, receita e custo são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar dados do pedido de venda
    const { data: soData, error: soError } = await supabase
      .from('sd_sales_order')
      .select('so_id, customer_id, total_final_cents')
      .eq('tenant_id', tenantId)
      .eq('so_id', so_id)
      .single()

    if (soError || !soData) {
      return NextResponse.json(
        { error: 'Pedido de venda não encontrado' },
        { status: 404 }
      )
    }

    // Criar lançamento contábil para expedição de venda
    const entryItems = [
      {
        account_code: '1.1.2.01', // Contas a Receber
        debit_cents: revenue_cents,
        credit_cents: 0,
        description: `Venda ${so_id} - Cliente`
      },
      {
        account_code: '3.1.1.01', // Receita de Vendas
        debit_cents: 0,
        credit_cents: revenue_cents,
        description: `Receita de venda ${so_id}`
      },
      {
        account_code: '4.1.1.01', // Custo dos Produtos Vendidos
        debit_cents: cogs_cents,
        credit_cents: 0,
        description: `CPV - ${so_id}`
      },
      {
        account_code: '1.1.1.01', // Estoque de Materiais
        debit_cents: 0,
        credit_cents: cogs_cents,
        description: `Baixa de estoque - ${so_id}`
      }
    ]

    const { data: entry, error: entryError } = await supabase
      .from('fi_accounting_entry')
      .insert({
        tenant_id: tenantId,
        entry_date: new Date().toISOString().split('T')[0],
        description: `Expedição de venda ${so_id}`,
        total_debit_cents: revenue_cents + cogs_cents,
        total_credit_cents: revenue_cents + cogs_cents,
        is_posted: true,
        created_by: 'system'
      })
      .select('entry_id')
      .single()

    if (entryError) {
      console.error('Error creating SO shipment entry:', entryError)
      return NextResponse.json(
        { error: 'Erro ao criar lançamento de expedição' },
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

    // Criar conta a receber
    const { error: arError } = await supabase
      .from('fi_accounts_receivable')
      .insert({
        tenant_id: tenantId,
        customer_id: soData.customer_id,
        so_id: so_id,
        amount_cents: revenue_cents,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 dias
        status: 'PENDING'
      })

    if (arError) {
      console.warn('Error creating accounts receivable:', arError)
      // Não falha a operação por causa da AR
    }

    return NextResponse.json({
      success: true,
      entry_id: entry.entry_id,
      message: 'Lançamento de expedição criado com sucesso'
    })

  } catch (error) {
    console.error('Error in SO shipment:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
