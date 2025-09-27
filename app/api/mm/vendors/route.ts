// app/api/mm/vendors/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function GET(req: Request) {
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const cookieStore = cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {}
      }
    }
  )
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const page = Number(url.searchParams.get("page") ?? 1);
  const pageSize = Math.min(Number(url.searchParams.get("pageSize") ?? 50), 200);

  const sb = supabaseServer();
  let query = sb.from("mm_vendor").select("*", { count: "exact" }).order("vendor_name");
  if (q) query = query.ilike("vendor_name", `%${q}%`).or(`vendor_id.ilike.%${q}%,email.ilike.%${q}%`);

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, count, error } = await query.range(from, to);
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });

  return NextResponse.json({ ok:true, items: data, total: count ?? 0, page, pageSize });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  // ✅ GUARDRAIL COMPLIANCE: API usando @supabase/ssr e cookies()
  const cookieStore = cookies()
  const sb = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set() {},
        remove() {}
      }
    }
  )

  const vendor = {
    vendor_id: body.vendor_id,
    vendor_name: body.vendor_name,
    email: body.email ?? null,
    telefone: body.telefone ?? null,
    cidade: body.cidade ?? null,
    estado: body.estado ?? null,
    vendor_rating: body.vendor_rating ?? null,
    contact_person: body.contact_person ?? null,
    address: body.address ?? null,
    city: body.city ?? null,
    state: body.state ?? null,
    zip_code: body.zip_code ?? null,
    country: body.country ?? "Brasil",
    tax_id: body.tax_id ?? null,
    payment_terms: body.payment_terms ?? 30,
    rating: body.rating ?? "B",
    status: body.status ?? "active"
  };

  const { data, error } = await sb.from("mm_vendor").insert(vendor).select("*").single();
  if (error) return NextResponse.json({ ok:false, error: error.message }, { status: 400 });
  return NextResponse.json({ ok:true, vendor: data }, { status: 201 });
}
