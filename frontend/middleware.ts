// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const PUBLIC_ROUTES = [
  "/login",
  "/auth/callback",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next",        // assets
  "/public",       // se existir
];

const PROTECTED_PREFIXES = ["/co", "/mm", "/sd", "/wh", "/crm", "/fi", "/analytics", "/"];

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies: ck } = req;
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return ck.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          res.cookies.set(name, value, options);
        },
        remove(name: string, options: any) {
          res.cookies.set(name, "", { ...options, maxAge: 0 });
        },
      },
    }
  );

  const pathname = nextUrl.pathname;

  // rota pública?
  const isPublic = PUBLIC_ROUTES.some((p) => pathname.startsWith(p));
  if (isPublic) return res;

  // rota protegida?
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname === p || pathname.startsWith(p));
  if (!isProtected) return res;

  const { data } = await supabase.auth.getSession();
  const session = data.session;

  // se não logado → empurra pro /login?next=
  if (!session) {
    const url = new URL("/login", nextUrl.origin);
    url.searchParams.set("next", pathname + (nextUrl.search || ""));
    return NextResponse.redirect(url);
  }

  // se logado tentando ver /login → volta pro next ou home
  if (pathname === "/login") {
    const next = nextUrl.searchParams.get("next") || "/";
    return NextResponse.redirect(new URL(next, nextUrl.origin));
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};