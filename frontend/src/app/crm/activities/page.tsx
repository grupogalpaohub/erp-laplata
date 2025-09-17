// app/crm/activities/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Activity = z.object({
  id: z.string(),
  activity_type: z.string(),
  subject: z.string(),
  description: z.string().nullable().optional(),
  due_date: z.string(),
  status: z.string(),
});
type Activity = z.infer<typeof Activity>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('crm_activity')
    .select('id, activity_type, subject, description, due_date, status')
    .order('due_date', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[CRM/Activities] supabase error', error);
    throw new Error('Falha ao carregar atividades');
  }

  const rows = z.array(Activity).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Atividades</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Tipo</th>
            <th className="py-2">Assunto</th>
            <th className="py-2">Descrição</th>
            <th className="py-2">Data Vencimento</th>
            <th className="py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.activity_type}</td>
              <td className="py-2">{r.subject}</td>
              <td className="py-2">{r.description ?? '-'}</td>
              <td className="py-2">{new Date(r.due_date).toLocaleDateString('pt-BR')}</td>
              <td className="py-2">{r.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}