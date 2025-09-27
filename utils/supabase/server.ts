import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

const isProd = process.env.NODE_ENV === "production";

export function supabaseServer() {
  const jar = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => jar.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          // ⚠️ Em localhost NÃO pode ser secure, senão o browser ignora
          const base = {
            path: "/",
            httpOnly: true,
            sameSite: "lax" as const,
            secure: isProd,                 // false no dev
          };
          jar.set({ name, value, ...base, ...options, secure: isProd });
        },
        remove: (name: string, options: any) => {
          const base = {
            path: "/",
            httpOnly: true,
            sameSite: "lax" as const,
            secure: isProd,
          };
          jar.set({ name, value: "", ...base, ...options, secure: isProd, maxAge: 0 });
        },
      },
    }
  );
}
