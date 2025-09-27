"use client";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function NavBar() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabaseBrowser.auth.getUser().then(({ data }: any) => setUser(data.user ?? null));
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange((_e: any, session: any) => {
      setUser(session?.user ?? null);
    });
    return () => { sub.subscription.unsubscribe(); };
  }, []);

  async function logout() {
    await supabaseBrowser.auth.signOut();
    router.replace("/login");
  }

  return (
    <header className="w-full border-b">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/dashboard" className="font-semibold">ERP V1</Link>
        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm opacity-70">{user.email}</span>
              <button onClick={logout} className="border rounded px-3 py-1">Sair</button>
            </>
          ) : (
            <Link href="/login" className="border rounded px-3 py-1">Entrar</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
