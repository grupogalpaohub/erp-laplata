export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';

function getOrigin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  return `${proto}://${host}`;
}

export default function LoginPage() {
  const origin = getOrigin();

  const googleUrl =
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google` +
    `&redirect_to=${encodeURIComponent(`${origin}/auth/callback`)}`;

  return (
    <main className="min-h-[70vh] flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl border p-6 bg-white/5">
        <h1 className="text-2xl font-semibold mb-6">ERP La Plata Lunaria</h1>
        <a
          className="w-full inline-flex items-center justify-center rounded-md border px-4 py-2 hover:bg-white/10"
          href={googleUrl}
        >
          Entrar com Google
        </a>
        <p className="text-xs mt-4 opacity-70">
          Você será redirecionado para {origin}/auth/callback após o login.
        </p>
      </div>
    </main>
  );
}