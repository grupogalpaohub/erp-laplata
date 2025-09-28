import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'

export function supabaseServer() {
  const cookieStore = cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          try { cookieStore.set({ name, value, ...options }) } catch {}
        },
        remove: (name: string, options: any) => {
          try { cookieStore.set({ name, value: '', ...options, maxAge: 0 }) } catch {}
        },
      },
    }
  )
}

// Helper para validação de tenant_id
export async function getTenantFromSession(): Promise<string> {
  const supabase = supabaseServer();
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error || !session) {
    throw new Error("Sessão não encontrada ou inválida.");
  }

  // Assumindo que o tenant_id está no payload do JWT ou em user_metadata
  const tenant_id = session.user?.user_metadata?.tenant_id || session.user?.app_metadata?.tenant_id;

  if (!tenant_id) {
    throw new Error("Tenant ID não encontrado na sessão.");
  }

  return tenant_id;
}