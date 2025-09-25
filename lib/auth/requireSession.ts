// lib/auth/requireSession.ts
import { getSupabaseServerClient } from "@/lib/supabase/server";

export type SessionInfo = { userId: string; email?: string | null };

export async function requireSession(): Promise<SessionInfo> {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new Error("UNAUTHENTICATED");
  return { userId: data.user.id, email: data.user.email };
}