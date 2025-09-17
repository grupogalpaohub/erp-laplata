// app/mm/catalog/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Item = z.object({
  id: z.string(),
  sku: z.string(),
  commercial_name: z.string(),
  unit: z.string().nullable().optional(),
});
type Item = z.infer<typeof Item>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('mm_material')
    .select('id, sku, commercial_name, unit')
    .limit(50);

  if (error) {
    console.error('[MM/Catalog] supabase error', error);
    throw new Error('Falha ao carregar catálogo');
  }

  const rows = z.array(Item).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Catálogo de Materiais</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">SKU</th>
            <th className="py-2">Descrição</th>
            <th className="py-2">Un.</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.sku}</td>
              <td className="py-2">{r.commercial_name}</td>
              <td className="py-2">{r.unit ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}