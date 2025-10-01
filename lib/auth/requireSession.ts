import { redirect } from 'next/navigation'
import { supabaseServer } from '@/utils/supabase/server'

export async function requireSession(nextPath: string = '/dashboard') {
  const supabase = supabaseServer()
  
  // Primeiro tenta getUser()
  const { data: userData, error: userError } = await supabase.auth.getUser()
  
  if (userData?.user) {
    return userData.user
  }
  
  // Se getUser() falhou, tenta getSession() como fallback
  const { data: sessionData, error: sessionError } = await supabase.auth.getSession()
  
  if (sessionData?.session?.user) {
    return sessionData.session.user
  }
  
  // Se ambos falharam, redireciona para login
  console.log('requireSession - No user found:', { userError: userError?.message, sessionError: sessionError?.message })
  redirect(`/login?next=${encodeURIComponent(nextPath)}`)
}