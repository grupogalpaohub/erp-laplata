import Link from 'next/link'
import { supabaseServer } from '@/lib/supabase/server'

export default async function Header() {
  const sb = supabaseServer()
  const { data } = await sb.auth.getSession()
  const session = data.session

  return (
    <header className="sticky top-0 z-10 bg-white border-b">
      <div className="mx-auto max-w-6xl flex items-center justify-between p-3">
        <div className="md:hidden font-bold text-[#0A6ED1]">ERP LaPlata</div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-slate-500">Tenant: LaplataLunaria</div>
          <div className="ml-auto">
            {session ? (
              <form action="/logout" method="post">
                <button type="submit" className="text-slate-600 hover:underline">
                  Sair
                </button>
              </form>
            ) : (
              <Link href="/login" className="text-blue-600 hover:underline">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}