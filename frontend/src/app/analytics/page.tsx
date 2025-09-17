// app/analytics/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Analytics = z.object({
  id: z.string(),
  metric_name: z.string(),
  metric_value: z.number(),
  period: z.string(),
  created_at: z.string(),
});
type Analytics = z.infer<typeof Analytics>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('analytics')
    .select('id, metric_name, metric_value, period, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[Analytics] supabase error', error);
    throw new Error('Falha ao carregar analytics');
  }

  const rows = z.array(Analytics).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Analytics</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Métrica</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Período</th>
            <th className="py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.metric_name}</td>
              <td className="py-2">{r.metric_value}</td>
              <td className="py-2">{r.period}</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}