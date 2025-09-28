'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function LoginClient() {
  const [email, setEmail] = useState('admin@teste.com');
  const [password, setPassword] = useState('teste123');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      const { data, error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
      if (error) { setErr(error.message); return; }

      const s = data.session;
      if (s) {
        await fetch('/api/auth/sync', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ access_token: s.access_token, refresh_token: s.refresh_token }),
          credentials: 'include',
        });
      }
      router.replace('/dashboard');
    } catch (e: any) {
      setErr(String(e?.message ?? e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-dvh flex items-center justify-center">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4">
        <h1 className="text-xl font-semibold">Entrar</h1>

        <label className="block text-sm">
          <span className="block mb-1">E-mail</span>
          <input type="email" className="w-full border rounded px-3 py-2"
                 defaultValue={email} onChange={(e)=>setEmail(e.target.value)} required />
        </label>

        <label className="block text-sm">
          <span className="block mb-1">Senha</span>
          <input type="password" className="w-full border rounded px-3 py-2"
                 defaultValue={password} onChange={(e)=>setPassword(e.target.value)} required />
        </label>

        {err && <p className="text-sm text-red-500">{err}</p>}

        <button type="submit" disabled={loading} className="w-full rounded px-3 py-2 border">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </main>
  );
}