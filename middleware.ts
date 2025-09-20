import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const pathname = req.nextUrl.pathname;

  console.log('[middleware] START:', { 
    pathname, 
    cookies: req.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value }) =>
            res.cookies.set({
              name,
              value,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: "lax",
              path: "/",
            })
          );
        },
      },
    }
  );

  const {
    data: { user },
    error: userError
  } = await supabase.auth.getUser();

  console.log('[middleware] getUser result:', { 
    hasUser: !!user, 
    userId: user?.id,
    error: userError?.message 
  });

  const isAuthPage = pathname.startsWith("/login");

  if (!user && !isAuthPage) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("next", pathname);
    console.log('[middleware] no user, redirecting to:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  if (user && isAuthPage) {
    console.log('[middleware] user logged in, redirecting to home');
    return NextResponse.redirect(new URL("/", req.url));
  }

  console.log('[middleware] allowing access to:', pathname);
  return res;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};