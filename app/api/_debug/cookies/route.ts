export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookies = req.cookies.getAll();
  return NextResponse.json({ cookies }, { status: 200 });
}
