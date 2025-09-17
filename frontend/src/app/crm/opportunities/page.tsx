// app/crm/opportunities/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Opportunity = z.object({
  id: z.string(),
  opportunity_id: z.string(),
  name: z.string(),
  value: z.number(),
  stage: z.string(),
  probability: z.number(),
  created_at: z.string(),
});
type Opportunity = z.infer<typeof Opportunity>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('crm_opportunity')
    .select('id, opportunity_id, name, value, stage, probability, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[CRM/Opportunities] supabase error', error);
    throw new Error('Falha ao carregar oportunidades');
  }

  const rows = z.array(Opportunity).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Oportunidades</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Estágio</th>
            <th className="py-2">Probabilidade</th>
            <th className="py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.opportunity_id}</td>
              <td className="py-2">{r.name}</td>
              <td className="py-2">R$ {(r.value / 100).toFixed(2)}</td>
              <td className="py-2">{r.stage}</td>
              <td className="py-2">{r.probability}%</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}