import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON } from "@/src/env";

const isProd = process.env.NODE_ENV === "production";

export function supabaseServer() {
  const jar = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get: (n) => jar.get(n)?.value,
      set: (n, v, o) => jar.set({ name: n, value: v, path: "/", httpOnly: true, sameSite: "lax", secure: isProd, ...o }),
      remove: (n, o) => jar.set({ name: n, value: "", path: "/", httpOnly: true, sameSite: "lax", secure: isProd, maxAge: 0, ...o }),
    },
  });
}
