import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: any) {
  const res = NextResponse.next();
  
  // Permitir acesso direto ao /login SEM verificação de sessão
  if (req.nextUrl.pathname === "/login") {
    return res;
  }
  
  // Permitir acesso a arquivos estáticos, APIs e auth
  if (req.nextUrl.pathname.startsWith('/_next') || 
      req.nextUrl.pathname.startsWith('/api') ||
      req.nextUrl.pathname.startsWith('/auth')) {
    return res;
  }
  
  // Permitir acesso ao onboarding
  if (req.nextUrl.pathname === "/onboarding") {
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
    
    // Se não estiver autenticado E tentando acessar páginas protegidas, redireciona para login
    const protectedPaths = ["/dashboard", "/mm", "/sd", "/wh", "/co", "/crm", "/fi", "/analytics"];
    if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path)) && !data.session) {
      return NextResponse.redirect(new URL("/login", req.url));
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
