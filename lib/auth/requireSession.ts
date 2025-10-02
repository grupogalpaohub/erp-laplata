import { redirect } from 'next/navigation'
import { supabaseServer } from '@/lib/supabase/server'

export async function requireSession(nextPath: string = '/dashboard') {
  try {
    const supabase = supabaseServer()
    
    // Tenta getUser() primeiro (mais confiável)
    const { data: userData, error: userError } = await supabase.auth.getUser()
    
    if (userData?.user && !userError) {
      return userData.user
    }
    
    // Se getUser() falhou, tenta getSession() como fallback
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
    
    if (sessionData?.session?.user && !sessionError) {
      return sessionData.session.user
    }
    
    // Log apenas se ambos falharam com erro
    if (userError || sessionError) {
      console.log('requireSession - Auth errors:', { 
        userError: userError?.message, 
        sessionError: sessionError?.message 
      })
    }
    
    // Se ambos falharam, redireciona para login
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  } catch (error) {
    console.error('requireSession - Unexpected error:', error)
    redirect(`/login?next=${encodeURIComponent(nextPath)}`)
  }
}
