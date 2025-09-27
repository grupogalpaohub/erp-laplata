import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function POST() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // AQUI pode setar/remover (Route Handler)
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set(name, value, options);
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set(name, "", { ...options, maxAge: 0 });
        },
      },
      global: { headers: { "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID! } },
    }
  );

  // força o supabase a sincronizar a sessão atual (refresca tokens se necessário)
  await supabase.auth.getSession();

  return NextResponse.json({ ok: true });
}
