import "./globals.css";
import Link from "next/link";
import { ReactNode } from "react";
import { supabaseServer } from "@/lib/supabase/server";

const modules = [
  { href: "/co",   label: "Controle" },
  { href: "/mm",   label: "Materiais" },
  { href: "/sd",   label: "Vendas" },
  { href: "/wh",   label: "Estoque" },
  { href: "/crm",  label: "CRM" },
  { href: "/fi",   label: "Financeiro" },
  { href: "/analytics", label: "Analytics" },
];

export default async function RootLayout({ children }: { children: ReactNode }) {
  const supabase = supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();

  return (
    <html lang="pt-BR">
      <body className="bg-[#F5F6F8] text-slate-900">
        <div className="flex min-h-dvh">
          {/* Sidebar */}
          <aside className="hidden md:flex w-60 flex-col border-r bg-white">
            <div className="px-4 py-4 font-bold text-[#0A6ED1] text-lg">ERP LaPlata</div>
            <nav className="px-2 py-2 space-y-1">
              {modules.map(m => (
                <Link key={m.href} href={m.href} className="block rounded px-3 py-2 hover:bg-slate-50">
                  {m.label}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Main */}
          <main className="flex-1">
            {/* Topbar */}
            <header className="sticky top-0 z-10 bg-white border-b">
              <div className="mx-auto max-w-6xl flex items-center justify-between p-3">
                <div className="md:hidden font-bold text-[#0A6ED1]">ERP LaPlata</div>
                <div className="flex items-center gap-4">
                  <div className="text-sm text-slate-500">Tenant: LaplataLunaria</div>
                  <div className="ml-auto">
                    {!session ? (
                      <Link href="/login" className="text-blue-600 hover:underline">Login</Link>
                    ) : (
                      <span className="text-slate-600">Olá, {session.user.email}</span>
                    )}
                  </div>
                </div>
              </div>
            </header>

            <div className="mx-auto max-w-6xl p-4">{children}</div>
          </main>
        </div>
      </body>
    </html>
  );
}
