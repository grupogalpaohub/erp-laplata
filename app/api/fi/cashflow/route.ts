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
    const months = parseInt(searchParams.get('months') || '12')

    // Calcular datas baseado no período
    const now = new Date()
    const startDate = new Date(now.getFullYear(), now.getMonth() - months, 1)

    // Buscar transações do período
    const { data: transactionsData, error: transactionsError } = await supabase
      .from('fi_transaction')
      .select('amount_cents, type, created_at')
      .eq('tenant_id', tenantId)
      .gte('created_at', startDate.toISOString())
      .lte('created_at', now.toISOString())
      .order('created_at', { ascending: true })

    if (transactionsError) {
      console.error('Error fetching cashflow data:', transactionsError)
      return NextResponse.json({ 
        ok: false, 
        error: { code: transactionsError.code, message: transactionsError.message } 
      }, { status: 500 })
    }

    // Agrupar por mês
    const monthlyData: { [key: string]: { inflows: number, outflows: number } } = {}
    
    transactionsData?.forEach(transaction => {
      const date = new Date(transaction.created_at)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = { inflows: 0, outflows: 0 }
      }
      
      if (transaction.type === 'credit') {
        monthlyData[monthKey].inflows += transaction.amount_cents
      } else {
        monthlyData[monthKey].outflows += transaction.amount_cents
      }
    })

    // Calcular saldo acumulado
    let runningBalance = 0
    const cashflowData = Object.entries(monthlyData).map(([month, data]) => {
      const netFlow = data.inflows - data.outflows
      runningBalance += netFlow
      
      return {
        month,
        inflows_cents: data.inflows,
        inflows_brl: data.inflows / 100,
        outflows_cents: data.outflows,
        outflows_brl: data.outflows / 100,
        net_flow_cents: netFlow,
        net_flow_brl: netFlow / 100,
        balance_cents: runningBalance,
        balance_brl: runningBalance / 100
      }
    })

    // Calcular totais
    const totalInflows = transactionsData?.filter(t => t.type === 'credit').reduce((sum: number, t: any) => sum + t.amount_cents, 0) || 0
    const totalOutflows = transactionsData?.filter(t => t.type === 'debit').reduce((sum: number, t: any) => sum + t.amount_cents, 0) || 0
    const netFlow = totalInflows - totalOutflows

    const cashflow = {
      period: period,
      months: months,
      start_date: startDate.toISOString().split('T')[0],
      end_date: now.toISOString().split('T')[0],
      summary: {
        total_inflows_cents: totalInflows,
        total_inflows_brl: totalInflows / 100,
        total_outflows_cents: totalOutflows,
        total_outflows_brl: totalOutflows / 100,
        net_flow_cents: netFlow,
        net_flow_brl: netFlow / 100,
        final_balance_cents: runningBalance,
        final_balance_brl: runningBalance / 100
      },
      monthly_data: cashflowData
    }

    return NextResponse.json({ ok: true, data: cashflow })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/fi/cashflow:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
