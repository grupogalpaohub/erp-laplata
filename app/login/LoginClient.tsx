// app/login/LoginClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/utils/supabase/browser";

export default function LoginClient() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@teste.com");
  const [password, setPassword] = useState("teste123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setErr(null);
    const sb = supabaseBrowser();

    // 1) signIn
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error || !data.session) { setErr(error?.message ?? "Login inválido"); setLoading(false); return; }

    // 2) sync SSR cookies - agora a API usa supabaseServer() com cookies completos
    await fetch("/api/auth/sync", {
      method: "POST",
      credentials: "include",
    });

    // 3) refresh session
    await fetch("/api/auth/refresh", { 
      method: "POST",
      credentials: "include" 
    });

    setLoading(false);
    router.replace("/dashboard");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setErr(null);
    const sb = supabaseBrowser();
    
    const { error } = await sb.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_BASE_URL || window.location.origin}/auth/callback`,
        queryParams: { prompt: "consent" }
      }
    });
    
    if (error) {
      setErr(error.message);
      setLoading(false);
    }
  };

  return (
    <main className="min-h-dvh grid place-content-center bg-gray-50">
      <div className="w-[420px] bg-white rounded-lg shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Entrar no ERP</h1>
          <p className="text-gray-600 mt-2">Acesse sua conta para continuar</p>
        </div>
        
        {/* Google OAuth Button */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {loading ? "Entrando..." : "Entrar com Google"}
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">ou</span>
          </div>
        </div>
        
        {/* Email/Password Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input 
              value={email} 
              onChange={e=>setEmail(e.target.value)} 
              placeholder="E-mail" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <input 
              type="password" 
              value={password} 
              onChange={e=>setPassword(e.target.value)} 
              placeholder="Senha" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {err && <p className="text-red-500 text-sm">{err}</p>}
          <button 
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}
