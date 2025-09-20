import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function GET(req: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
      },
    }
  );

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return NextResponse.json(
    {
      hasSession: !!user,
      user,
      error,
    },
    { status: 200 }
  );
}
