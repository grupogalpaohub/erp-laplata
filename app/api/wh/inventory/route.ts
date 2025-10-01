import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const supabase = supabaseServer();

  try {
    // Buscar inventário com dados do material
    const { data: inventory, error: inventoryError } = await supabase
      .from('wh_inventory_balance')
      .select(`
        mm_material,
        plant_id,
        on_hand_qty,
        reserved_qty,
        mm_material_data:mm_material(
          mm_comercial,
          mm_desc
        )
      `)
      .order('mm_material');

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

    // Processar dados do inventário
    const processedInventory = inventory?.map(item => {
      const availableQty = (item.on_hand_qty || 0) - (item.reserved_qty || 0);
      const unitCostCents = priceMap.get(item.mm_material) || 0;
      const totalCents = availableQty * unitCostCents;

      return {
        mm_material: item.mm_material,
        plant_id: item.plant_id,
        on_hand_qty: item.on_hand_qty || 0,
        reserved_qty: item.reserved_qty || 0,
        available_qty: availableQty,
        unit_cost_cents: unitCostCents,
        total_cents: totalCents,
        material_info: item.mm_material_data
      };
    }) || [];

    return NextResponse.json({ ok: true, data: processedInventory }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'INTERNAL_ERROR', message: error.message } 
    }, { status: 500 });
  }
}