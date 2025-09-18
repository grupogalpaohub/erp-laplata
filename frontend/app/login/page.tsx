'use client';
import { createClient } from '@supabase/supabase-js';

export default function LoginPage() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  async function signInWithGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div style={{display:'grid', gap:12}}>
      <h1>Login</h1>
      <button onClick={signInWithGoogle} style={{padding:'8px 12px'}}>
        Entrar com Google
      </button>
    </div>
  );
}
