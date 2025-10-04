import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || 'month' // month, quarter, year

    // Calcular datas baseado no período
    const now = new Date()
    let startDate: Date
    
    switch (period) {
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1)
        break
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1)
        break
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1)
    }

    // 1. Total de Receitas (créditos)
    const { data: revenueData, error: revenueError } = await supabase
      .from('fi_transaction')
      .select('amount_cents')
      .eq('tenant_id', tenantId)
      .eq('type', 'credit')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    if (revenueError) {
      console.error('Error fetching revenue data:', revenueError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: revenueError.code, message: revenueError.message } 
      }, { status: 500 })
    }

    const totalRevenueCents = revenueData?.reduce((sum, transaction) => sum + (transaction.amount_cents || 0), 0) || 0

    // 2. Total de Despesas (débitos)
    const { data: expenseData, error: expenseError } = await supabase
      .from('fi_transaction')
      .select('amount_cents')
      .eq('tenant_id', tenantId)
      .eq('type', 'debit')
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    if (expenseError) {
      console.error('Error fetching expense data:', expenseError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: expenseError.code, message: expenseError.message } 
      }, { status: 500 })
    }

    const totalExpenseCents = expenseData?.reduce((sum, transaction) => sum + (transaction.amount_cents || 0), 0) || 0

    // 3. Total de Faturas Emitidas
    const { data: invoicesData, error: invoicesError } = await supabase
      .from('fi_invoice')
      .select('amount_cents')
      .eq('tenant_id', tenantId)
      .gte('invoice_date', startDate.toISOString().split('T')[0])
      .lte('invoice_date', now.toISOString().split('T')[0])

    if (invoicesError) {
      console.error('Error fetching invoices data:', invoicesError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: invoicesError.code, message: invoicesError.message } 
      }, { status: 500 })
    }

    const totalInvoicesCents = invoicesData?.reduce((sum, invoice) => sum + (invoice.amount_cents || 0), 0) || 0

    // 4. Faturas Vencidas
    const today = new Date().toISOString().split('T')[0]
    const { data: overdueInvoicesData, error: overdueError } = await supabase
      .from('fi_invoice')
      .select('amount_cents')
      .eq('tenant_id', tenantId)
      .lt('due_date', today)

    if (overdueError) {
      console.error('Error fetching overdue invoices data:', overdueError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: overdueError.code, message: overdueError.message } 
      }, { status: 500 })
    }

    const totalOverdueCents = overdueInvoicesData?.reduce((sum, invoice) => sum + (invoice.amount_cents || 0), 0) || 0

    // 5. Total de Contas
    const { count: accountsCount, error: accountsError } = await supabase
      .from('fi_account')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)

    if (accountsError) {
      console.error('Error fetching accounts count:', accountsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: accountsError.code, message: accountsError.message } 
      }, { status: 500 })
    }

    // 6. Total de Transações no Período
    const { count: transactionsCount, error: transactionsError } = await supabase
      .from('fi_transaction')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', tenantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())

    if (transactionsError) {
      console.error('Error fetching transactions count:', transactionsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: transactionsError.code, message: transactionsError.message } 
      }, { status: 500 })
    }

    const kpis = {
      revenue: {
        total_cents: totalRevenueCents,
        total_brl: totalRevenueCents / 100,
        period: period,
        start_date: startDate.toISOString().split('T')[0],
        end_date: now.toISOString().split('T')[0]
      },
      expenses: {
        total_cents: totalExpenseCents,
        total_brl: totalExpenseCents / 100,
        period: period
      },
      profit: {
        total_cents: totalRevenueCents - totalExpenseCents,
        total_brl: (totalRevenueCents - totalExpenseCents) / 100,
        margin_percent: totalRevenueCents > 0 ? ((totalRevenueCents - totalExpenseCents) / totalRevenueCents) * 100 : 0
      },
      invoices: {
        total_issued_cents: totalInvoicesCents,
        total_issued_brl: totalInvoicesCents / 100,
        overdue_cents: totalOverdueCents,
        overdue_brl: totalOverdueCents / 100,
        period: period
      },
      accounts: {
        total_count: accountsCount || 0
      },
      transactions: {
        total_count: transactionsCount || 0,
        period: period
      }
    }

    return NextResponse.json({ ok: true, data: kpis })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/fi/kpis:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
