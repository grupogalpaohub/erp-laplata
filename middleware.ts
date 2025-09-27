
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: ["/((?!_next|static|public|favicon.ico|login|logout|api/health).*)"],
};

export function middleware(req: NextRequest) {
  // se já existe controle de sessão, mantenha
  // NUNCA colocar tenant aqui
  return NextResponse.next();
}

