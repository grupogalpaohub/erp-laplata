"use client";
import { useEffect } from "react";
import { supabaseBrowser } from "@/lib/supabase/client";

export default function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const { data: sub } = supabaseBrowser.auth.onAuthStateChange(async (event, session) => {
      await fetch("/api/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event, session }),
      });
    });
    return () => sub.subscription.unsubscribe();
  }, []);
  return <>{children}</>;
}
