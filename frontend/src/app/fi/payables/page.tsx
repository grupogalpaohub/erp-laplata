// app/fi/payables/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Payable = z.object({
  id: z.string(),
  payable_id: z.string(),
  vendor_id: z.string(),
  amount: z.number(),
  due_date: z.string(),
  status: z.string(),
  created_at: z.string(),
});
type Payable = z.infer<typeof Payable>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('fi_payable')
    .select('id, payable_id, vendor_id, amount, due_date, status, created_at')
    .order('due_date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[FI/Payables] supabase error', error);
    throw new Error('Falha ao carregar contas a pagar');
  }

  const rows = z.array(Payable).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Contas a Pagar</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Fornecedor</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Vencimento</th>
            <th className="py-2">Status</th>
            <th className="py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.payable_id}</td>
              <td className="py-2">{r.vendor_id}</td>
              <td className="py-2">R$ {(r.amount / 100).toFixed(2)}</td>
              <td className="py-2">{new Date(r.due_date).toLocaleDateString('pt-BR')}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}