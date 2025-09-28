'use client';

import React, { useEffect, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function Providers({ children }: { children: React.ReactNode }) {
  // cria uma instância do cliente apenas uma vez no browser
  const supabase = useMemo(() => supabaseBrowser(), []);

  useEffect(() => {
    // assina mudanças de auth e sincroniza cookies httpOnly com o server
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      try {
        await fetch('/api/auth/refresh', {
          method: 'GET',
          credentials: 'include',
        });
      } catch {
        // silencioso por segurança; sem logs de segredos
      }
    });

    return () => {
      sub?.subscription.unsubscribe();
    };
  }, [supabase]);

  return <>{children}</>;
}
