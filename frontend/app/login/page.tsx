// src/app/login/page.tsx
import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { next?: string };
}) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();

  // já logado? manda pro next ou home
  if (data.session) {
    redirect(searchParams?.next || "/");
  }

  const site = process.env.NEXT_PUBLIC_SITE_URL!;
  const supa = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const next = encodeURIComponent(searchParams?.next || "/");

  const authUrl =
    `${supa}/auth/v1/authorize` +
    `?provider=google&redirect_to=${encodeURIComponent(`${site}/auth/callback?next=${next}`)}`;

  return (
    <main style={{ maxWidth: 720, margin: "2rem auto" }}>
      <h1>Entrar</h1>
      <p>Tenant: LaplataLunaria</p>
      <a
        href={authUrl}
        className="inline-block rounded bg-blue-600 px-3 py-2 text-white"
      >
        Continuar com Google
      </a>
    </main>
  );
}
