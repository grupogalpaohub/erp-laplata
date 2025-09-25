import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ⚠️ Somente para DEV/local. Em produção responde 403.
export async function GET(request: Request) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }
  const hdr = request.headers.get("x-local-dev");
  if (hdr !== "true") {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

  // ⚠️ NÃO hardcodar tenant aqui. Sem Auth, listamos tudo em DEV.
  // Em PROD, esta rota é bloqueada.
  const { data, error } = await supabase
    .from("sd_sales_order")
    .select("so_id, status, customer_id, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
