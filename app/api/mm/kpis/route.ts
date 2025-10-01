import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const supabase = supabaseServer();

  try {
    // Buscar contagem de materiais
    const { count: totalMaterials, error: materialsError } = await supabase
      .from('mm_material')
      .select('*', { count: 'exact', head: true });

    if (materialsError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: materialsError.code, message: materialsError.message } 
      }, { status: 500 });
    }

    // Buscar contagem de pedidos de compra
    const { count: totalPurchaseOrders, error: ordersError } = await supabase
      .from('mm_purchase_order')
      .select('*', { count: 'exact', head: true });

    if (ordersError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: ordersError.code, message: ordersError.message } 
      }, { status: 500 });
    }

    // Buscar compras do mês atual
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    const { data: monthPurchases, error: monthError } = await supabase
      .from('mm_purchase_order')
      .select('total_cents')
      .gte('po_date', firstDayOfMonth.toISOString().split('T')[0])
      .lte('po_date', lastDayOfMonth.toISOString().split('T')[0]);

    if (monthError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: monthError.code, message: monthError.message } 
      }, { status: 500 });
    }

    // Buscar total de compras acumulado
    const { data: totalPurchases, error: totalError } = await supabase
      .from('mm_purchase_order')
      .select('total_cents');

    if (totalError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: totalError.code, message: totalError.message } 
      }, { status: 500 });
    }

    // Calcular totais
    const monthPurchasesTotal = monthPurchases?.reduce((sum, order) => sum + (order.total_cents || 0), 0) || 0;
    const totalPurchasesTotal = totalPurchases?.reduce((sum, order) => sum + (order.total_cents || 0), 0) || 0;

    const kpis = {
      total_materials: totalMaterials || 0,
      total_purchase_orders: totalPurchaseOrders || 0,
      month_purchases_cents: monthPurchasesTotal,
      total_purchases_cents: totalPurchasesTotal
    };

    return NextResponse.json({ ok: true, data: kpis }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'INTERNAL_ERROR', message: error.message } 
    }, { status: 500 });
  }
}
