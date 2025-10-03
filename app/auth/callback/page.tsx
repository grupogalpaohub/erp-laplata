import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerClient } from "@supabase/ssr"

export default async function AuthCallback({ 
  searchParams 
}: { 
  searchParams: { code?: string; error?: string } 
}) {
  const code = searchParams?.code
  const error = searchParams?.error
  
  if (error) redirect(`/login?error=${error}`)
  if (!code) redirect("/login?error=no_code")

  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => cookieStore.get(name)?.value,
        set: (name, value, options) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name, options) => {
          cookieStore.set({ name, value: "", ...options, expires: new Date(0) })
        }
      }
    }
  )

  const { error: authError } = await supabase.auth.exchangeCodeForSession(code)
  if (authError) redirect(`/login?error=${authError.message}`)

  // Verificar tenant_id
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.tenant_id) {
    redirect("/onboarding")
  }

  redirect("/")
}