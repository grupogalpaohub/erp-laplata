// app/setup/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Setup = z.object({
  id: z.string(),
  module: z.string(),
  setting_name: z.string(),
  setting_value: z.string(),
  updated_at: z.string(),
});
type Setup = z.infer<typeof Setup>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('setup')
    .select('id, module, setting_name, setting_value, updated_at')
    .order('updated_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[Setup] supabase error', error);
    throw new Error('Falha ao carregar configurações');
  }

  const rows = z.array(Setup).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Configuração do Sistema</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Módulo</th>
            <th className="py-2">Configuração</th>
            <th className="py-2">Valor</th>
            <th className="py-2">Atualizado em</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.module}</td>
              <td className="py-2">{r.setting_name}</td>
              <td className="py-2">{r.setting_value}</td>
              <td className="py-2">{new Date(r.updated_at).toLocaleDateString('pt-BR')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}