'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '@/lib/supabaseBrowser';

export default function AuthCallbackPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get('next') || '/';
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  useEffect(() => {
    async function finalize() {
      try {
        if (search.get('code')) {
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) console.error('[auth] exchangeCodeForSession error:', error);
        } else if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          const { error } = await supabase.auth.getSessionFromUrl({ storeSession: true });
          if (error) console.error('[auth] getSessionFromUrl error:', error);
        }
      } finally {
        router.replace(next);
      }
    }
    finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div style={{display:'grid',placeItems:'center',height:'50vh'}}><p>Finalizando login…</p></div>;
}