
// ============================================================================
// 🔒 REGRAS IRREVERSÍVEIS - NÃO ALTERAR
// ============================================================================
// ❌ PROIBIDO: Hardcode de tenant (LaplataLunaria, etc.)
// ❌ PROIBIDO: process.env.TENANT_ID (não existe no .env.local)
// ❌ PROIBIDO: Alterar .env.local
// ❌ PROIBIDO: Desabilitar RLS
// ❌ PROIBIDO: SERVICE_ROLE_KEY no frontend
// ✅ OBRIGATÓRIO: Usar NEXT_PUBLIC_AUTH_DISABLED
// ✅ OBRIGATÓRIO: Investigação profunda antes de corrigir
// ============================================================================
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'experimental-edge';
export const config = {
  matcher: ['/((?!_next|assets|public|favicon.ico|api|auth).*)'],
};

const PUBLIC = new Set(['/', '/login']);

export async function middleware(req: NextRequest) {
  // Bypass total quando auth está desativada em dev
  if (process.env.NEXT_PUBLIC_AUTH_DISABLED === 'true') {
    return NextResponse.next();
  }

  const { pathname } = req.nextUrl;

  if (PUBLIC.has(pathname)) return NextResponse.next();

  // Por enquanto, deixa passar tudo para testar
  return NextResponse.next();
}

