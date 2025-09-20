import Link from 'next/link'
import { supabaseServer } from '@/src/lib/supabase/server'
import { hasSession } from '@/src/lib/auth'
import LoginClient from './LoginClient'

export const dynamic = 'force-dynamic'

export async function generateMetadata() { 
  return { title: 'Login' } 
}

export default async function LoginPage({ searchParams }: { searchParams?: { next?: string } }) {
  const next = searchParams?.next || '/'
  
  if (!hasSession()) {
    return <LoginClient next={next} />
  }

  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    return (
      <main style={{ padding: '2rem' }}>
        <h1>Já logado</h1>
        <p>Você já está logado. <Link href={next}>Continuar</Link></p>
      </main>
    )
  }

  return <LoginClient next={next} />
}