import Link from 'next/link'

export default function LoginPage({ searchParams }:{ searchParams?: Record<string,string|undefined> }) {
  const next = searchParams?.next || '/'
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const supa = process.env.NEXT_PUBLIC_SUPABASE_URL
  const authorize = `${supa}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(`${site}/auth/callback?next=${encodeURIComponent(String(next))}`)}`
  return (
    <main style={{ padding:24 }}>
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <p>Tenant: LaplataLunaria</p>
      <p><a className="underline" href={authorize}>Continuar com Google</a></p>
      <p className="mt-3"><Link className="underline" href="/">Voltar</Link></p>
    </main>
  )
}
