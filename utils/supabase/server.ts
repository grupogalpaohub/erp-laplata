import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function supabaseServer() {
  const jar = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => jar.get(name)?.value,
        // IMPORTANTES: permitem que o client do SSR atualize/expire os cookies
        set: (name: string, value: string, options: any) => {
          jar.set({ name, value, ...options });
        },
        remove: (name: string, options: any) => {
          jar.set({ name, value: "", ...options });
        },
      },
    }
  );
}
