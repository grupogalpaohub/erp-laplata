// app/sd/invoices/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Invoice = z.object({
  id: z.string(),
  invoice_number: z.string(),
  customer_id: z.string(),
  status: z.string(),
  total_amount: z.number(),
  due_date: z.string(),
});
type Invoice = z.infer<typeof Invoice>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('sd_invoice')
    .select('id, invoice_number, customer_id, status, total_amount, due_date')
    .order('due_date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[SD/Invoices] supabase error', error);
    throw new Error('Falha ao carregar faturas');
  }

  const rows = z.array(Invoice).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Faturas</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Número</th>
            <th className="py-2">Cliente</th>
            <th className="py-2">Status</th>
            <th className="py-2">Valor Total</th>
            <th className="py-2">Vencimento</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.invoice_number}</td>
              <td className="py-2">{r.customer_id}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">R$ {(r.total_amount / 100).toFixed(2)}</td>
              <td className="py-2">{new Date(r.due_date).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}