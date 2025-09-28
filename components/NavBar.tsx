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
    const supabase = supabaseBrowser() // <- chama a função

    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user ?? null)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      // evita leak de listener no HMR
      sub?.subscription?.unsubscribe?.()
    }
  }, []);

  async function logout() {
    const supabase = supabaseBrowser()
    await supabase.auth.signOut();
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
