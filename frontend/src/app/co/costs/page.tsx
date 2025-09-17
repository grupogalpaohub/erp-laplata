// app/co/costs/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Cost = z.object({
  id: z.string(),
  cost_center_id: z.string(),
  cost_type: z.string(),
  amount: z.number(),
  period: z.string(),
  created_at: z.string(),
});
type Cost = z.infer<typeof Cost>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('co_cost')
    .select('id, cost_center_id, cost_type, amount, period, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[CO/Costs] supabase error', error);
    throw new Error('Falha ao carregar custos');
  }

  const rows = z.array(Cost).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Análise de Custos</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Centro de Custo</th>
            <th className="py-2">Tipo de Custo</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Período</th>
            <th className="py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.cost_center_id}</td>
              <td className="py-2">{r.cost_type}</td>
              <td className="py-2">R$ {(r.amount / 100).toFixed(2)}</td>
              <td className="py-2">{r.period}</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}