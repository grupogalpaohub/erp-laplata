import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'

export async function GET(req: Request) {
  try {
    // ✅ GUARDRAIL COMPLIANCE: API usando supabaseServer() helper
    const supabase = supabaseServer()
    
    // Tenant fixo conforme guardrails
    const TENANT_ID = "LaplataLunaria"
    
    // 1. Total de materiais
    const { data: materialsData, error: materialsError } = await supabase
      .from('mm_material')
      .select('*', { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
    
    if (materialsError) {
      console.error('Erro ao buscar materiais:', materialsError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (materialsError as any).code, 
          message: materialsError.message 
        } 
      }, { status: 500 })
    }
    
    // 2. Total de purchase orders
    const { data: poData, error: poError } = await supabase
      .from('mm_purchase_order')
      .select('*', { count: 'exact' })
      .eq('tenant_id', TENANT_ID)
    
    if (poError) {
      console.error('Erro ao buscar purchase orders:', poError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (poError as any).code, 
          message: poError.message 
        } 
      }, { status: 500 })
    }
    
    // 3. Compras do mês atual
    const currentDate = new Date()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    
    const { data: monthPurchasesData, error: monthPurchasesError } = await supabase
      .from('mm_purchase_order')
      .select('total_cents')
      .eq('tenant_id', TENANT_ID)
      .gte('order_date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('order_date', lastDayOfMonth.toISOString().split('T')[0])
      .not('total_cents', 'is', null)
    
    if (monthPurchasesError) {
      console.error('Erro ao buscar compras do mês:', monthPurchasesError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (monthPurchasesError as any).code, 
          message: monthPurchasesError.message 
        } 
      }, { status: 500 })
    }
    
    // 4. Total de compras (todos os tempos)
    const { data: totalPurchasesData, error: totalPurchasesError } = await supabase
      .from('mm_purchase_order')
      .select('total_cents')
      .eq('tenant_id', TENANT_ID)
      .not('total_cents', 'is', null)
    
    if (totalPurchasesError) {
      console.error('Erro ao buscar total de compras:', totalPurchasesError)
      return NextResponse.json({ 
        ok: false, 
        error: { 
          code: (totalPurchasesError as any).code, 
          message: totalPurchasesError.message 
        } 
      }, { status: 500 })
    }
    
    // Calcular totais
    const monthPurchases = monthPurchasesData?.reduce((sum: number, po: any) => sum + (po.total_cents || 0), 0) || 0
    const totalPurchases = totalPurchasesData?.reduce((sum: number, po: any) => sum + (po.total_cents || 0), 0) || 0
    
    const kpis = {
      total_materials: materialsData?.length || 0,
      total_purchase_orders: poData?.length || 0,
      month_purchases_cents: Math.round(monthPurchases),
      month_purchases_brl: Math.round(monthPurchases / 100),
      total_purchases_cents: Math.round(totalPurchases),
      total_purchases_brl: Math.round(totalPurchases / 100),
      current_month: currentDate.getMonth() + 1,
      current_year: currentDate.getFullYear(),
      last_updated: new Date().toISOString()
    }
    
    return NextResponse.json({ 
      ok: true, 
      data: kpis
    })
    
  } catch (error) {
    console.error('Erro inesperado na API mm/kpis:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { 
        code: 'INTERNAL_ERROR', 
        message: 'Erro interno do servidor' 
      } 
    }, { status: 500 })
  }
}