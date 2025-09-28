import { supabaseServer } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LoginClient from "./LoginClient";

export default async function Page() {
  const supabase = supabaseServer();
  const { data } = await supabase.auth.getSession();
  if (data.session) redirect("/dashboard");
  return <LoginClient />;
}