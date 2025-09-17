// app/fi/cashflow/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Cashflow = z.object({
  id: z.string(),
  date: z.string(),
  description: z.string(),
  amount: z.number(),
  type: z.string(),
  balance: z.number(),
});
type Cashflow = z.infer<typeof Cashflow>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('fi_cashflow')
    .select('id, date, description, amount, type, balance')
    .order('date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[FI/Cashflow] supabase error', error);
    throw new Error('Falha ao carregar fluxo de caixa');
  }

  const rows = z.array(Cashflow).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Fluxo de Caixa</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Data</th>
            <th className="py-2">Descrição</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Tipo</th>
            <th className="py-2">Saldo</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{new Date(r.date).toLocaleDateString('pt-BR')}</td>
              <td className="py-2">{r.description}</td>
              <td className="py-2">R$ {(r.amount / 100).toFixed(2)}</td>
              <td className="py-2">{r.type}</td>
              <td className="py-2">R$ {(r.balance / 100).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}