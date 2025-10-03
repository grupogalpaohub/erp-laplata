import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";

export const runtime = 'nodejs';

export default async function Home() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();
  
  if (data.session) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}
