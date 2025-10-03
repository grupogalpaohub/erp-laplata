// Função temporária que retorna tenant padrão
// TODO: Implementar verificação real de tenant quando necessário
export async function getTenantId(): Promise<string | null> {
  // Por enquanto, retornar tenant padrão
  // Isso evita problemas de cookies no Vercel
  return "LaplataLunaria";
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