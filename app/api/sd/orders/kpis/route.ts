import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const supabase = supabaseServer();

  try {
    // Buscar contagem total de pedidos
    const { count: totalOrders, error: ordersError } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true });

    if (ordersError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: ordersError.code, message: ordersError.message } 
      }, { status: 500 });
    }

    // Buscar contagem de pedidos aprovados
    const { count: approvedOrders, error: approvedError } = await supabase
      .from('sd_sales_order')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved');

    if (approvedError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: approvedError.code, message: approvedError.message } 
      }, { status: 500 });
    }

    // Buscar todos os pedidos para calcular ticket médio
    const { data: allOrders, error: allOrdersError } = await supabase
      .from('sd_sales_order')
      .select('total_cents')
      .not('total_cents', 'is', null);

    if (allOrdersError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: allOrdersError.code, message: allOrdersError.message } 
      }, { status: 500 });
    }

    // Calcular ticket médio
    const totalValue = allOrders?.reduce((sum: number, order: any) => sum + (order.total_cents || 0), 0) || 0;
    const avgTicket = totalOrders > 0 ? Math.round(totalValue / totalOrders) : 0;

    const kpis = {
      total_orders: totalOrders || 0,
      approved_orders: approvedOrders || 0,
      avg_ticket_cents: avgTicket,
      total_value_cents: totalValue
    };

    return NextResponse.json({ ok: true, data: kpis }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'INTERNAL_ERROR', message: error.message } 
    }, { status: 500 });
  }
}
