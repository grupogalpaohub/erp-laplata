export const runtime = 'edge';

import { supabaseServer } from '@/lib/supabaseServer';

export default async function FICashflowPage() {
  const supabase = supabaseServer();
  let ping: any = null;
  try {
    const { data } = await supabase.from('materials').select('*').limit(1);
    ping = data ?? null;
  } catch {}

  return (
    <main className="p-6">
      <h1 className="text-xl font-semibold">Fluxo de Caixa</h1>
      <p className="mt-2 text-sm text-gray-500">
        runtime: edge • supabase ping: {ping ? 'ok' : '—'}
      </p>
    </main>
  );
}