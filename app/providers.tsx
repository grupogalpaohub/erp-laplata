'use client';

import React, { useEffect, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function Providers({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => supabaseBrowser(), []);

  // 1) Sincroniza cookies httpOnly IMEDIATAMENTE no mount
  useEffect(() => {
    // Primeiro sync, depois refresh
    fetch('/api/auth/sync', { method: 'POST', credentials: 'include' })
      .then(() => fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' }))
      .catch(() => {});
  }, []);

  // 2) Sincroniza cookies a cada mudança de auth
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      try {
        // Primeiro sync, depois refresh
        await fetch('/api/auth/sync', { method: 'POST', credentials: 'include' });
        await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      } catch {}
    });
    return () => sub?.subscription.unsubscribe();
  }, [supabase]);

  return <>{children}</>;
}
