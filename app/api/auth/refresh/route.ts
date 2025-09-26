import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

export async function POST(req: Request) {
  const { event, session } = await req.json();
  const res = NextResponse.json({ ok: true });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookies().get(name)?.value,
        set: (name: string, value: string, options: CookieOptions) => res.cookies.set(name, value, options),
        remove: (name: string, options: CookieOptions) => res.cookies.delete(name),
      },
      global: { headers: { "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID! } },
    }
  );

  if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
    await supabase.auth.setSession(session);
  } else if (event === "SIGNED_OUT") {
    await supabase.auth.signOut();
  }
  return res;
}
