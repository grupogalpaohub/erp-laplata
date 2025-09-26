
// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// reforça tenant para todas as requisições (RLS depende do JWT; isso é só header auxiliar)
export function middleware(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("x-tenant-id", process.env.NEXT_PUBLIC_TENANT_ID || "LaplataLunaria");
  return res;
}

// NÃO intercepte assets, nem /login
export const config = {
  matcher: ["/((?!_next|static|public|favicon.ico|login|api/health).*)"],
};

