// middleware.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: Request) {
  const url = new URL(req.url);

  // Rotas sempre liberadas
  const publicPaths = ["/login", "/auth/callback", "/favicon.ico", "/_next", "/api"];
  if (publicPaths.some((p) => url.pathname.startsWith(p))) return NextResponse.next();

  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n) => req.headers.get("cookie"), set: () => {}, remove: () => {} } }
  );

  const { data } = await supabase.auth.getUser();
  if (!data.user) {
    const redirectTo = `/login?next=${encodeURIComponent(url.pathname)}`;
    return NextResponse.redirect(new URL(redirectTo, req.url));
  }
  return res;
}

export const config = { matcher: ["/((?!_next|.*\\..*).*)"] };