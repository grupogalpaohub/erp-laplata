// lib/auth/requireSession.ts
import { createClient } from '@supabase/supabase-js';

export type SessionInfo = { userId: string; email?: string | null };

export async function requireSession(): Promise<SessionInfo> {
  // Para desenvolvimento, retorna sessão mock
  if (process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true') {
    return { userId: 'dev-user', email: 'dev@local.com' };
  }

  // Para produção, tentar autenticação real
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error("UNAUTHENTICATED");
    return { userId: data.user.id, email: data.user.email };
  } catch (error) {
    throw new Error("UNAUTHENTICATED");
  }
}
