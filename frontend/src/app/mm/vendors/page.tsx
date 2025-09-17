// app/mm/vendors/page.tsx
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

import { z } from 'zod';
import { createServerClient } from '@/lib/supabase/server';

const Vendor = z.object({
  id: z.string(),
  vendor_id: z.string(),
  name: z.string(),
  email: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
});
type Vendor = z.infer<typeof Vendor>;

export default async function Page() {
  const supabase = createServerClient();

  // não cachear
  const { unstable_noStore } = await import('next/cache');
  unstable_noStore?.();

  const { data, error } = await supabase
    .from('mm_vendor')
    .select('id, vendor_id, name, email, phone')
    .limit(50);

  if (error) {
    console.error('[MM/Vendors] supabase error', error);
    throw new Error('Falha ao carregar fornecedores');
  }

  const rows = z.array(Vendor).parse(data ?? []);

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Fornecedores</h1>
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">ID</th>
            <th className="py-2">Nome</th>
            <th className="py-2">Email</th>
            <th className="py-2">Telefone</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => (
            <tr key={r.id} className="border-b">
              <td className="py-2">{r.vendor_id}</td>
              <td className="py-2">{r.name}</td>
              <td className="py-2">{r.email ?? '-'}</td>
              <td className="py-2">{r.phone ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}