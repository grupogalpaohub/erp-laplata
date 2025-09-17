// app/co/dashboard/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const CostCenter = z.object({
  id: z.string(),
  cost_center_id: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  status: z.string(),
});
type CostCenter = z.infer<typeof CostCenter>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('co_cost_center')
    .select('id, cost_center_id, name, description, status')
    .limit(50);

  if (error) {
    console.error('[CO/Dashboard] supabase error', error);
    throw new Error('Falha ao carregar centros de custo');
  }

  const rows = z.array(CostCenter).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard CO</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Descrição</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.cost_center_id}</td>
              <td className="py-2">{r.name}</td>
              <td className="py-2">{r.description ?? '-'}</td>
              <td className="py-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}