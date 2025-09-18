// app/login/page.tsx
import { supabaseServer } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function LoginPage({ searchParams }: { searchParams: { next?: string } }) {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getUser();
  if (data.user) redirect(searchParams.next ? decodeURIComponent(searchParams.next) : "/");

  async function signIn() {
    "use server";
    const next = searchParams.next ? decodeURIComponent(searchParams.next) : "/";
    const supabase = supabaseServer();
    const { data } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://erp-laplata.vercel.app"}/auth/callback?next=${encodeURIComponent(next)}`
      }
    });
    return redirect(data.url ?? "/");
  }

  return (
    <form action={signIn} className="mx-auto max-w-sm mt-16 bg-white border rounded-xl p-6">
      <h1 className="text-lg font-semibold mb-4">Entrar</h1>
      <button className="w-full rounded bg-[#0A6ED1] text-white py-2">Continuar com Google</button>
    </form>
  );
}
