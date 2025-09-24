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
        console.log('[CALLBACK] Processando callback...');
        
        if (search.get('code')) {
          console.log('[CALLBACK] Tem code, fazendo exchangeCodeForSession...');
          const { error } = await supabase.auth.exchangeCodeForSession(window.location.href);
          if (error) {
            console.error('[CALLBACK] exchangeCodeForSession error:', error);
          } else {
            console.log('[CALLBACK] Sessão criada com sucesso!');
          }
        } else if (typeof window !== 'undefined' && window.location.hash.includes('access_token')) {
          console.log('[CALLBACK] Tem access_token no hash...');
          const { error } = await supabase.auth.getSession();
          if (error) {
            console.error('[CALLBACK] getSessionFromUrl error:', error);
          } else {
            console.log('[CALLBACK] Sessão criada do hash!');
          }
        }
        
        console.log('[CALLBACK] Redirecionando para:', next);
        router.replace(next);
      } catch (error) {
        console.error('[CALLBACK] Erro geral:', error);
        router.replace('/');
      }
    }
    finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div style={{display:'grid',placeItems:'center',height:'50vh'}}>
      <p>Finalizando login...</p>
    </div>
  );
}
