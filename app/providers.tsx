'use client'
import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { supabaseBrowser } from '@/lib/supabase/client'

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Não executar nada na callback
    if (pathname?.startsWith("/auth/")) return

    const supabase = supabaseBrowser()
    
    // Apenas escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        // Sessão muda automaticamente via cookies
        // Não precisa fazer nada especial
      }
    )

    return () => subscription.unsubscribe()
  }, [pathname])

  return <>{children}</>
}