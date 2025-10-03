import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"
import { getTenantId } from "@/utils/tenant"

export default async function AuthCallback({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams?.code
  if (!code) redirect("/login?error=missing_code")

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => cookieStore.set({ name, value, ...options }),
        remove: (name, options) =>
          cookieStore.set({ name, value: "", ...options, expires: new Date(0) }),
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  // se você já tem onboarding/tenant:
  // - checar se existe user_metadata.tenant_id
  // - se não houver, redirect("/onboarding")
  const tenantId = await getTenantId();
  if (!tenantId) {
    redirect("/onboarding");
  }

  redirect("/")
}
