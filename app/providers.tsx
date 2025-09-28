'use client';

import React, { useEffect, useMemo } from 'react';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function Providers({ children }: { children: React.ReactNode }) {
  const supabase = useMemo(() => supabaseBrowser(), []);

  // 1) Sincroniza cookies httpOnly IMEDIATAMENTE no mount
  useEffect(() => {
    fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' }).catch(() => {});
  }, []);

  // 2) Sincroniza cookies a cada mudança de auth
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      try {
        await fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' });
      } catch {}
    });
    return () => sub?.subscription.unsubscribe();
  }, [supabase]);

  return <>{children}</>;
}
