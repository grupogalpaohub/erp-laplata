// app/(protected)/onboarding/page.tsx
import Link from "next/link";
import { isAllowedTenant } from "@/utils/tenant";

export default function OnboardingPage() {
  // Não criamos UI nova complexa. Apenas instrução e botão rápido para o tenant único permitido.
  const tenant = "LaplataLunaria";
  const valid = isAllowedTenant(tenant);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Confirmar acesso</h1>
      <p className="mb-4">Seu usuário ainda não está associado a um tenant. Clique para confirmar o tenant permitido.</p>
      <form method="post" action="/api/auth/set-tenant">
        <input type="hidden" name="tenant_id" value={tenant} />
        <button
          type="submit"
          className="px-4 py-2 rounded bg-primary text-primary-foreground"
          disabled={!valid}
          aria-disabled={!valid}
        >
          Confirmar tenant: {tenant}
        </button>
      </form>
      <p className="text-sm text-muted-foreground mt-4">
        Se não era para você acessar este ambiente, <Link href="/logout" className="underline">sair</Link>.
      </p>
    </div>
  );
}
