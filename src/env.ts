// src/env.ts
function must(name: string) {
  const v = (process.env[name] ?? "").trim();
  if (!v) throw new Error(`Missing env ${name}`);
  return v;
}

export const SUPABASE_URL = must("NEXT_PUBLIC_SUPABASE_URL");

export const SUPABASE_ANON =
  (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim() ||
  (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY ?? "").trim();

// sanity check: evita rodar com header vazio
if (!SUPABASE_ANON) {
  throw new Error("Missing anon/publishable key (NEXT_PUBLIC_SUPABASE_ANON_KEY or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY)");
}
