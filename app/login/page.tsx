export const dynamic = 'force-dynamic';

import { headers } from 'next/headers';
import Link from 'next/link';

function getOrigin() {
  const h = headers();
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? '';
  return `${proto}://${host}`;
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; next?: string };
}) {
  const origin = getOrigin();
  const error = searchParams.error;
  const next = searchParams.next || '/';

  // Debug: log das variáveis de ambiente
  console.log('[login] Environment check:', {
    NEXT_PUBLIC_SUPABASE_URL: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    origin,
    error,
    next
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gpjcfwjssfvqhppxdudp.supabase.co';
  
  const googleUrl =
    `${supabaseUrl}/auth/v1/authorize?provider=google` +
    `&redirect_to=${encodeURIComponent(`${origin}/auth/callback?next=${encodeURIComponent(next)}`)}` +
    `&timestamp=${Date.now()}`; // Cache busting

  const getErrorMessage = (error: string) => {
    switch (error) {
      case 'no_code':
        return 'Código de autorização não recebido. Tente novamente.';
      case 'oauth_error':
        return 'Erro no processo de autenticação. Tente novamente.';
      case 'session_error':
        return 'Erro ao criar sessão. Tente novamente.';
      case 'no_user':
        return 'Usuário não encontrado. Tente novamente.';
      case 'callback_failed':
        return 'Erro no callback de autenticação. Tente novamente.';
      default:
        return 'Erro desconhecido. Tente novamente.';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fiori-primary to-fiori-accent flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <span className="text-fiori-primary font-bold text-3xl">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ERP La Plata</h1>
          <p className="text-white/80">Sistema de Gestão Empresarial</p>
        </div>

        {/* Card de Login */}
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">
            Entrar no Sistema
          </h2>

          {/* Erro */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-lg">
              <p className="text-red-200 text-sm text-center">
                {getErrorMessage(error)}
              </p>
            </div>
          )}

          {/* Botão Google */}
          <a
            href={googleUrl}
            className="w-full inline-flex items-center justify-center px-6 py-4 bg-white text-fiori-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Entrar com Google
          </a>

          <p className="text-white/70 text-sm text-center mt-4">
            Você será redirecionado para o sistema após o login
          </p>

          {/* Debug info */}
          <div className="mt-6 p-3 bg-black/20 rounded-lg">
            <p className="text-white/50 text-xs text-center">
              Debug: {process.env.NEXT_PUBLIC_SUPABASE_URL ? 'URL OK' : 'URL MISSING'}
            </p>
            <p className="text-white/50 text-xs text-center mt-1">
              Redirect: {origin}/auth/callback
            </p>
          </div>
        </div>

        {/* Link para Landing */}
        <div className="text-center mt-6">
          <Link
            href="/landing"
            className="text-white/70 hover:text-white text-sm underline"
          >
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}