import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { getTenantId } from "@/utils/tenant";

export default async function AuthCallbackPage({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams?.code || "";
  const sb = supabaseServer();

  if (code) {
    await sb.auth.exchangeCodeForSession(code);
  }

  // se ainda não tiver tenant -> onboarding
  const tenantId = await getTenantId();
  if (!tenantId) {
    redirect("/onboarding");
  }

  // ok, sessão + tenant definidos
  redirect("/");
}
