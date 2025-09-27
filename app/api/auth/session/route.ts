import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, value, options } = await req.json();
  const cookieStore = cookies();

  cookieStore.set(name, value, options);

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: Request) {
  const { name, options } = await req.json();
  const cookieStore = cookies();

  cookieStore.set(name, "", { ...options, maxAge: 0 });

  return NextResponse.json({ ok: true });
}
