// app/crm/leads/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Lead = z.object({
  id: z.string(),
  lead_id: z.string(),
  name: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  status: z.string(),
  created_at: z.string(),
});
type Lead = z.infer<typeof Lead>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('crm_lead')
    .select('id, lead_id, name, email, phone, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[CRM/Leads] supabase error', error);
    throw new Error('Falha ao carregar leads');
  }

  const rows = z.array(Lead).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Leads</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Email</th>
            <th className="py-2">Telefone</th>
            <th className="py-2">Status</th>
            <th className="py-2">Criado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.lead_id}</td>
              <td className="py-2">{r.name}</td>
              <td className="py-2">{r.email ?? '-'}</td>
              <td className="py-2">{r.phone ?? '-'}</td>
              <td className="py-2">{r.status}</td>
              <td className="py-2">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}