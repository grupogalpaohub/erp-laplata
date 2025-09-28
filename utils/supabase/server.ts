import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON } from "@/src/env";

const isProd = process.env.NODE_ENV === "production";

export function supabaseServer() {
  const jar = cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      get: (name) => jar.get(name)?.value,
      set: (name, value, options) =>
        jar.set({
          name,
          value,
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: isProd,
          ...options,
        }),
      remove: (name, options) =>
        jar.set({
          name,
          value: "",
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: isProd,
          maxAge: 0,
          ...options,
        }),
    },
  });
}