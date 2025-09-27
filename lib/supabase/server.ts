import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export function getServerSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const tenantId = process.env.NEXT_PUBLIC_TENANT_ID;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', {
      url: !!supabaseUrl,
      key: !!supabaseAnonKey
    });
    throw new Error('Missing Supabase environment variables');
  }

  const cookieStore = cookies();
  return createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Em Server Components, Next NÃO permite set/remove de cookies.
        // O Supabase pode tentar atualizar o token durante o render.
        // Capturamos e ignoramos aqui; quem realmente deve setar é a rota /api/auth/refresh.
        set(name: string, value: string, options: CookieOptions) {
          // ignore: só é permitido em Server Action/Route Handler
          // A sincronização real de cookies fica centralizada na rota /api/auth/refresh
        },
        remove(name: string, options: CookieOptions) {
          // ignore: só é permitido em Server Action/Route Handler
          // A sincronização real de cookies fica centralizada na rota /api/auth/refresh
        },
      },
      global: { headers: { "x-tenant-id": tenantId || "LaplataLunaria" } },
    }
  );
}

// Manter compatibilidade com código existente
export const getSupabaseServerClient = getServerSupabase;