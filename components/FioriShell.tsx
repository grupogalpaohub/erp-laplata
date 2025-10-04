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
  
  // Para rotas protegidas, não fazer verificação de auth aqui
  // O requireSession() no layout já faz isso no server
  const isProtectedRoute = pathname?.startsWith("/dashboard") || 
                          pathname?.startsWith("/mm") || 
                          pathname?.startsWith("/sd") || 
                          pathname?.startsWith("/wh") || 
                          pathname?.startsWith("/fi") || 
                          pathname?.startsWith("/crm") || 
                          pathname?.startsWith("/co") || 
                          pathname?.startsWith("/analytics") || 
                          pathname?.startsWith("/reports") || 
                          pathname?.startsWith("/setup") || 
                          pathname?.startsWith("/onboarding")
  const isAuthRoute = pathname?.startsWith("/auth/") || pathname === "/login"
  
  useEffect(() => {
    console.log('🔍 FioriShell useEffect - pathname:', pathname, 'isProtectedRoute:', isProtectedRoute)
    
    // Se for rota de auth, não fazer nada
    if (isAuthRoute) {
      console.log('🔍 FioriShell - rota de auth, não verificando')
      return
    }

    const supabase = supabaseBrowser()
    
    // Para rotas protegidas, apenas obter user para NavBar
    // Para outras rotas, fazer verificação completa
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname, isAuthRoute, isProtectedRoute])

  console.log('🔍 FioriShell render - pathname:', pathname, 'user:', user, 'isProtectedRoute:', isProtectedRoute)

  // Se for rota de auth, renderizar children imediatamente
  if (isAuthRoute) {
    console.log('🔍 FioriShell - rota de auth, renderizando children')
    return <>{children}</>
  }

  // Para rotas protegidas, renderizar com NavBar (requireSession já verificou auth)
  if (isProtectedRoute) {
    console.log('🔍 FioriShell - rota protegida, renderizando com NavBar')
    return (
      <div className="min-h-screen bg-gray-900">
        {user && <NavBar user={user} />}
        <main className="flex-1">
          {children}
        </main>
      </div>
    )
  }

  // Para outras rotas, fazer verificação de auth
  if (!user) {
    console.log('🔍 FioriShell - usuário não autenticado, redirecionando')
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