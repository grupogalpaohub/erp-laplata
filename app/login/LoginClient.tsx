// app/login/LoginClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

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

    // 2) sync SSR cookies
    await fetch("/api/auth/sync", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      }),
      credentials: "include",
    });

    // 3) opcional: ping
    await fetch("/api/auth/refresh", { credentials: "include" });

    setLoading(false);
    router.replace("/dashboard");
  };

  return (
    <main className="min-h-dvh grid place-content-center">
      <form onSubmit={onSubmit} className="w-[420px] space-y-3">
        <h1>Entrar</h1>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="E-mail" />
        <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" />
        {err && <p style={{color:"salmon"}}>{err}</p>}
        <button disabled={loading}>{loading ? "Entrando..." : "Entrar"}</button>
      </form>
    </main>
  );
}