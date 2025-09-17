// app/wh/reports/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Report = z.object({
  id: z.string(),
  report_name: z.string(),
  generated_at: z.string(),
  status: z.string(),
});
type Report = z.infer<typeof Report>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('wh_report')
    .select('id, report_name, generated_at, status')
    .order('generated_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[WH/Reports] supabase error', error);
    throw new Error('Falha ao carregar relatórios');
  }

  const rows = z.array(Report).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Relatórios WH</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Nome do Relatório</th>
            <th className="py-2">Status</th>
            <th className="py-2">Gerado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.report_name}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">{new Date(r.generated_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}