"use client";
import { createClient } from "@supabase/supabase-js";

export const supabaseBrowser = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storageKey: "erpv1-auth",
    },
    global: {
      headers: {
        "x-tenant-id": process.env.NEXT_PUBLIC_TENANT_ID!,
      },
    },
  }
);
