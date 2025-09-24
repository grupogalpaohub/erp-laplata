import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    
    const body = await request.json()
    const { 
      entry_type, // 'PO_RECEIPT', 'SO_SHIPMENT', 'INVENTORY_ADJUSTMENT'
      reference_id,
      reference_table,
      amount_cents,
      description,
      items // Array of { account_code, debit_cents, credit_cents, description }
    } = body

    // Validar dados obrigatórios
    if (!entry_type || !reference_id || !amount_cents || !items) {
      return NextResponse.json(
        { error: 'Tipo de lançamento, referência, valor e itens são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar equilíbrio contábil
    const totalDebit = items.reduce((sum: number, item: any) => sum + (item.debit_cents || 0), 0)
    const totalCredit = items.reduce((sum: number, item: any) => sum + (item.credit_cents || 0), 0)

    if (totalDebit !== totalCredit) {
      return NextResponse.json(
        { error: 'Lançamento não está equilibrado (débito ≠ crédito)' },
        { status: 400 }
      )
    }

    // Criar lançamento contábil
    const { data: entry, error: entryError } = await supabase
      .from('fi_accounting_entry')
      .insert({
        tenant_id: tenantId,
        entry_date: new Date().toISOString().split('T')[0],
        description: description || `Lançamento automático - ${entry_type}`,
        total_debit_cents: totalDebit,
        total_credit_cents: totalCredit,
        is_posted: true,
        created_by: 'system'
      })
      .select('entry_id')
      .single()

    if (entryError) {
      console.error('Error creating accounting entry:', entryError)
      return NextResponse.json(
        { error: 'Erro ao criar lançamento contábil' },
        { status: 500 }
      )
    }

    // Criar itens do lançamento
    const entryItems = items.map((item: any) => ({
      entry_id: entry.entry_id,
      tenant_id: tenantId,
      account_code: item.account_code,
      debit_cents: item.debit_cents || 0,
      credit_cents: item.credit_cents || 0,
      description: item.description || ''
    }))

    const { error: itemsError } = await supabase
      .from('fi_accounting_entry_item')
      .insert(entryItems)

    if (itemsError) {
      console.error('Error creating entry items:', itemsError)
      // Tentar reverter o lançamento
      await supabase
        .from('fi_accounting_entry')
        .delete()
        .eq('entry_id', entry.entry_id)
      
      return NextResponse.json(
        { error: 'Erro ao criar itens do lançamento' },
        { status: 500 }
      )
    }

    // Atualizar saldos das contas
    for (const item of items) {
      await supabase.rpc('update_account_balance', {
        p_tenant_id: tenantId,
        p_account_code: item.account_code,
        p_debit_cents: item.debit_cents || 0,
        p_credit_cents: item.credit_cents || 0
      })
    }

    return NextResponse.json({
      success: true,
      entry_id: entry.entry_id,
      message: 'Lançamento contábil criado com sucesso'
    })

  } catch (error) {
    console.error('Error in auto entries:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
