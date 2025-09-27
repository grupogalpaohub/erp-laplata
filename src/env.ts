// src/env.ts
export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL!;

export const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY
  ?? "";

if (!SUPABASE_URL || !SUPABASE_ANON) {
  throw new Error("Supabase env vars missing: URL/ANON");
}
