import Link from "next/link";
import { isAllowedTenant } from "@/utils/tenant";

export const dynamic = 'force-dynamic';

export default function OnboardingPage() {
  const tenant = "LaplataLunaria";
  const valid = isAllowedTenant(tenant);

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Confirmar acesso</h1>
          <p className="text-gray-400 mb-6">
            Seu usuário ainda não está associado a um tenant. Clique para confirmar o tenant permitido.
          </p>
        </div>
        
        <form method="post" action="/api/auth/set-tenant" className="space-y-6">
          <input type="hidden" name="tenant_id" value={tenant} />
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!valid}
            aria-disabled={!valid}
          >
            Confirmar tenant: {tenant}
          </button>
        </form>
        
        <p className="text-sm text-gray-400 text-center">
          Se não era para você acessar este ambiente,{" "}
          <Link href="/logout" className="text-blue-400 hover:text-blue-300 underline">
            sair
          </Link>
          .
        </p>
      </div>
    </div>
  );
}