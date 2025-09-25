"use client";

import { useState } from "react";

export default function DevLoginPage() {
  const [email, setEmail] = useState("dev@local.com");
  const [password, setPassword] = useState("senha123");
  const [status, setStatus] = useState<string>("");

  async function doLogin(e: React.FormEvent) {
    e.preventDefault();
    setStatus("Entrando...");
    const r = await fetch("/auth/dev-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const j = await r.json();
    if (r.ok) setStatus(`OK: ${j.user?.email ?? "user"}`);
    else setStatus(`Erro: ${j.error}`);
  }

  async function doLogout() {
    await fetch("/auth/dev-logout", { method: "POST" });
    setStatus("Logout OK");
  }

  return (
    <div className="p-6 max-w-md space-y-4">
      <h1 className="text-xl font-bold">Login DEV (local)</h1>
      <form onSubmit={doLogin} className="space-y-2">
        <input className="w-full rounded bg-zinc-800 p-2" value={email} onChange={e=>setEmail(e.target.value)} placeholder="email" />
        <input className="w-full rounded bg-zinc-800 p-2" value={password} onChange={e=>setPassword(e.target.value)} placeholder="senha" type="password" />
        <button className="px-3 py-2 rounded bg-blue-600">Entrar</button>
      </form>
      <button className="px-3 py-2 rounded bg-zinc-700" onClick={doLogout}>Sair</button>
      <div className="text-sm opacity-80">{status}</div>
    </div>
  );
}
