"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = supabaseBrowser();
    const { data: sub } = supabase.auth.onAuthStateChange(async () => {
      // sempre que a sessão mudar no cliente, peça ao servidor para atualizar cookies
      await fetch("/api/auth/refresh", { method: "POST" });
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return <>{children}</>;
}
