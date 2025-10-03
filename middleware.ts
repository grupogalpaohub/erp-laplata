import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  const res = NextResponse.next();
  
  // Evitar loops infinitos - se já está redirecionando, não redireciona novamente
  if (req.nextUrl.pathname.startsWith('/login') && req.headers.get('x-redirect-count')) {
    return res;
  }
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
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

  try {
    const { data } = await supabase.auth.getSession();
    
    // Se estiver autenticado E tentando acessar /login, redireciona para dashboard
    if (req.nextUrl.pathname === "/login" && data.session) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    
    // Se não estiver autenticado E tentando acessar páginas protegidas, redireciona para login
    const protectedPaths = ["/dashboard", "/mm", "/sd", "/wh", "/co", "/crm", "/fi", "/analytics"];
    if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !data.session) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set('redirect', req.nextUrl.pathname);
      return NextResponse.redirect(loginUrl);
    }
    
    // Se não estiver autenticado E tentando acessar /, redireciona para login
    if (req.nextUrl.pathname === "/" && !data.session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  } catch (error) {
    console.error('Middleware auth error:', error);
    // Em caso de erro, redireciona para login
    if (req.nextUrl.pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }
  
  return res;
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
