"use client"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { supabaseBrowser } from "@/lib/supabase/client"
import NavBar from "./NavBar"

interface User {
  id: string
  email?: string
  user_metadata?: {
    tenant_id?: string
  }
}

export default function FioriShell({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    console.log('🔍 FioriShell useEffect - pathname:', pathname)
    if (pathname?.startsWith("/auth/") || pathname === "/login") {
      console.log('🔍 FioriShell - rota permitida, setLoading(false)')
      setLoading(false)
      return
    }

    const supabase = supabaseBrowser()
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname])

  console.log('🔍 FioriShell render - loading:', loading, 'user:', user, 'pathname:', pathname)

  if (loading) {
    console.log('🔍 FioriShell - mostrando loading')
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    )
  }

  if (!user) {
    console.log('🔍 FioriShell - mostrando redirect para login')
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-white mb-4">Redirecionando para login...</div>
          <Link 
            href="/login" 
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Clique aqui se não for redirecionado
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <NavBar user={user} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}