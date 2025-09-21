export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test endpoint working!',
    timestamp: new Date().toISOString()
  });
}

