import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const supabase = supabaseServer();

  try {
    // Buscar dados do inventário
    const { data: inventory, error: inventoryError } = await supabase
      .from('wh_inventory_balance')
      .select('mm_material, on_hand_qty, reserved_qty');

    if (inventoryError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: inventoryError.code, message: inventoryError.message } 
      }, { status: 500 });
    }

    // Buscar último preço de compra de cada material
    const { data: lastPrices, error: pricesError } = await supabase
      .from('mm_purchase_order_item')
      .select('mm_material, unit_cost_cents')
      .order('po_item_id', { ascending: false });

    if (pricesError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: pricesError.code, message: pricesError.message } 
      }, { status: 500 });
    }

    // Criar mapa de preços por material
    const priceMap = new Map();
    lastPrices?.forEach(item => {
      if (!priceMap.has(item.mm_material)) {
        priceMap.set(item.mm_material, item.unit_cost_cents);
      }
    });

    // Calcular KPIs
    let totalItems = 0;
    let totalValue = 0;
    let lowStock = 0;
    let outOfStock = 0;

    inventory?.forEach(item => {
      const availableQty = (item.on_hand_qty || 0) - (item.reserved_qty || 0);
      const unitCost = priceMap.get(item.mm_material) || 0;
      
      if (availableQty > 0) {
        totalItems++;
        totalValue += availableQty * unitCost;
      }
      
      if (availableQty <= 0) {
        outOfStock++;
      } else if (availableQty <= 10) { // threshold de baixo estoque
        lowStock++;
      }
    });

    const summary = {
      total_items: totalItems,
      total_value_cents: totalValue,
      low_stock: lowStock,
      out_of_stock: outOfStock
    };

    return NextResponse.json({ ok: true, data: summary }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'INTERNAL_ERROR', message: error.message } 
    }, { status: 500 });
  }
}
