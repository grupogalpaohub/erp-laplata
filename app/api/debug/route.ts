import { NextResponse } from 'next/server'
import { supabaseServer } from '@/utils/supabase/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET() {
  // Testar com supabaseServer() vs createServerClient direto
  const supabase1 = supabaseServer()
  const cookieStore = cookies()
  const supabase2 = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => {
          const cookie = cookieStore.get(name)
          return cookie?.value
        },
        set: (name: string, value: string, options: any) => {
          try {
            cookieStore.set({
              name,
              value,
              ...options,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            })
          } catch (error) {
            console.error('Error setting cookie:', error)
          }
        },
        remove: (name: string, options: any) => {
          try {
            cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax'
            })
          } catch (error) {
            console.error('Error removing cookie:', error)
          }
        },
      },
    }
  )
  
  // Verificar sessão com ambos
  const { data: { session: session1 } } = await supabase1.auth.getSession()
  const { data: { user: user1 } } = await supabase1.auth.getUser()
  
  const { data: { session: session2 } } = await supabase2.auth.getSession()
  const { data: { user: user2 } } = await supabase2.auth.getUser()
  
  return NextResponse.json({
    supabaseServer: {
      hasSession: !!session1,
      hasUser: !!user1,
      userEmail: user1?.email,
      tenantId: user1?.user_metadata?.tenant_id
    },
    createServerClient: {
      hasSession: !!session2,
      hasUser: !!user2,
      userEmail: user2?.email,
      tenantId: user2?.user_metadata?.tenant_id
    },
    timestamp: new Date().toISOString()
  })
}
