'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('admin@teste.com')
  const [password, setPassword] = useState('teste123')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const router = useRouter()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErr(null)
    setLoading(true)

    const supabase = supabaseBrowser()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setErr(error.message)
      setLoading(false)
      return
    }

    // Sincronizar sessão com o servidor
    const s = data.session;
    if (s) {
      try {
        await fetch("/api/auth/sync", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            access_token: s.access_token,
            refresh_token: s.refresh_token,
          }),
          credentials: "include", // garante set/carry de cookies
        });
      } catch (syncError) {
        console.warn("Erro ao sincronizar sessão:", syncError);
        // Continua mesmo com erro de sincronização
      }
    }

    setLoading(false)
    router.replace('/dashboard')
  }

  return (
    <main className="min-h-dvh flex items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-4 border rounded-xl p-5">
        <h1 className="text-xl font-semibold">Entrar</h1>
        <div className="space-y-2">
          <label className="text-sm">E-mail</label>
          <input className="w-full border rounded px-3 py-2" value={email} onChange={e=>setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Senha</label>
          <input className="w-full border rounded px-3 py-2" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
        </div>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full rounded px-3 py-2 border">
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}