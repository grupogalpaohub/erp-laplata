"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("admin@teste.com");
  const [password, setPassword] = useState("teste123");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setErr(null);
    const { error } = await supabaseBrowser.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { setErr(error.message); return; }
    router.replace("/dashboard");
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