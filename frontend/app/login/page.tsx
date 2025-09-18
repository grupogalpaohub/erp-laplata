'use client'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
export default function Page() {
  const origin = typeof window !== 'undefined'
    ? window.location.origin
    : (process.env.NEXT_PUBLIC_SITE_URL || '')
  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${origin}/auth/callback` }
    })
  }
  return (<div style={{display:'grid', gap:12}}>
    <h1>Login</h1><button onClick={signIn}>Entrar com Google</button>
  </div>)
}
