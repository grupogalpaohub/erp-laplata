import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export function getSupabaseServerClient() {
  const cookieStore = cookies(); // Next 14 (App Router)
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          // Só permite modificar cookies em Route Handlers, não em Server Components
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // Ignora erro se não for Route Handler
          }
        },
        remove(name: string, options: any) {
          // Só permite modificar cookies em Route Handlers, não em Server Components
          try {
            cookieStore.set({ name, value: "", ...options, maxAge: 0 });
          } catch (error) {
            // Ignora erro se não for Route Handler
          }
        },
      },
    }
  );
  return supabase;
}