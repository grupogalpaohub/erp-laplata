// app/mm/purchases/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const PurchaseOrder = z.object({
  id: z.string(),
  po_number: z.string(),
  vendor_id: z.string(),
  status: z.string(),
  total_amount: z.number(),
  created_at: z.string(),
});
type PurchaseOrder = z.infer<typeof PurchaseOrder>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('mm_purchase_order')
    .select('id, po_number, vendor_id, status, total_amount, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[MM/Purchases] supabase error', error);
    throw new Error('Falha ao carregar compras');
  }

  const rows = z.array(PurchaseOrder).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Compras</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">PO Number</th>
            <th className="py-2">Fornecedor</th>
            <th className="py-2">Status</th>
            <th className="py-2">Valor Total</th>
            <th className="py-2">Data</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.po_number}</td>
              <td className="py-2">{r.vendor_id}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">R$ {(r.total_amount / 100).toFixed(2)}</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}