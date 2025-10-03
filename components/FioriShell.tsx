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
  const pathname = usePathname()
  
  // Definir loading baseado na rota IMEDIATAMENTE
  const loading = !(pathname?.startsWith("/auth/") || pathname === "/login")
  const [userLoading, setUserLoading] = useState(true)

  useEffect(() => {
    console.log('🔍 FioriShell useEffect - pathname:', pathname)
    if (pathname?.startsWith("/auth/") || pathname === "/login") {
      console.log('🔍 FioriShell - rota permitida, setUserLoading(false)')
      setUserLoading(false)
      return
    }

    const supabase = supabaseBrowser()
    
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setUserLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
        setUserLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname])

  console.log('🔍 FioriShell render - loading:', loading, 'userLoading:', userLoading, 'user:', user, 'pathname:', pathname)

  // Se for rota de login/auth, renderizar children imediatamente
  if (!loading) {
    console.log('🔍 FioriShell - rota permitida, renderizando children')
    return <>{children}</>
  }

  if (userLoading) {
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