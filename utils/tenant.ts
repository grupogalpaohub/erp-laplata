// utils/tenant.ts
import { supabaseServer } from "@/lib/supabase/server";

export async function getTenantId(): Promise<string | null> {
  const sb = supabaseServer(); // NUNCA passar argumentos
  const { data: { user }, error } = await sb.auth.getUser();
  if (error) return null;
  const t = user?.user_metadata?.tenant_id;
  return t && typeof t === "string" && t.trim() ? t : null;
}

// lança se não houver tenant
export async function requireTenantId(): Promise<string> {
  const t = await getTenantId();
  if (!t) throw new Error("MISSING_TENANT_ID");
  return t;
}

// lista branca de tenants válidos (temporário, sem UI nova)
export const ALLOWED_TENANTS = ["LaplataLunaria"] as const;
export function isAllowedTenant(x: string): x is typeof ALLOWED_TENANTS[number] {
  return ALLOWED_TENANTS.includes(x as any);
}
