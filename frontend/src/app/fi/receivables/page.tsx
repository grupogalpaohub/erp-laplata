// app/fi/receivables/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Receivable = z.object({
  id: z.string(),
  receivable_id: z.string(),
  customer_id: z.string(),
  amount: z.number(),
  due_date: z.string(),
  status: z.string(),
  created_at: z.string(),
});
type Receivable = z.infer<typeof Receivable>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('fi_receivable')
    .select('id, receivable_id, customer_id, amount, due_date, status, created_at')
    .order('due_date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[FI/Receivables] supabase error', error);
    throw new Error('Falha ao carregar contas a receber');
  }

  const rows = z.array(Receivable).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Contas a Receber</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Cliente</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Vencimento</th>
            <th className="py-2">Status</th>
            <th className="py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.receivable_id}</td>
              <td className="py-2">{r.customer_id}</td>
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