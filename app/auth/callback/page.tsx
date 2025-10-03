import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"

export default async function AuthCallback({ searchParams }: { searchParams: { code?: string } }) {
  const code = searchParams?.code
  if (!code) redirect("/login?error=missing_code")

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          return cookieStore.get(name)?.value
        },
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: "", ...options, expires: new Date(0) })
        },
      },
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) redirect(`/login?error=${encodeURIComponent(error.message)}`)

  // se faltar tenant_id no JWT, mande para onboarding
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.tenant_id) redirect("/onboarding")

  redirect("/")
}
