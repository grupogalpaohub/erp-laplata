'use client';

import { useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginPage() {
  const params = useSearchParams();
  const next = params.get('next') || '/';

  const signin = async () => {
    const supabase = supabaseBrowser();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=${encodeURIComponent(next)}`,
        queryParams: { prompt: 'select_account' },
      },
    });
  };

  return (
    <main style={{ padding: '2rem' }}>
      <h1>Entrar</h1>
      <p>Tenant: LaplataLunaria</p>
      <button onClick={signin}>Continuar com Google</button>
    </main>
  );
}
