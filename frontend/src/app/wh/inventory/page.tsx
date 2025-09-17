// app/wh/inventory/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const InventoryItem = z.object({
  id: z.string(),
  sku: z.string(),
  plant_id: z.string(),
  quantity: z.number(),
  unit: z.string().nullable().optional(),
});
type InventoryItem = z.infer<typeof InventoryItem>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('wh_inventory_balance')
    .select('id, sku, plant_id, quantity, unit')
    .limit(50);

  if (error) {
    console.error('[WH/Inventory] supabase error', error);
    throw new Error('Falha ao carregar estoque');
  }

  const rows = z.array(InventoryItem).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Estoque</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">SKU</th>
            <th className="py-2">Depósito</th>
            <th className="py-2">Quantidade</th>
            <th className="py-2">Unidade</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.sku}</td>
              <td className="py-2">{r.plant_id}</td>
              <td className="py-2">{r.quantity}</td>
              <td className="py-2">{r.unit ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}