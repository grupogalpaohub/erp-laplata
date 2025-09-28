// app/api/mm/purchases/[po_id]/route.ts
// ROTA LEGACY - Redirecionamento para nova API
// GUARDRAIL COMPLIANCE: Apenas redirecionamento, sem Supabase

import { NextResponse } from 'next/server';

export async function GET(_: Request, { params }: { params: { po_id: string } }) {
  // Redirecionar para nova API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return NextResponse.redirect(
    new URL(`/api/mm/purchase-orders?mm_order=${encodeURIComponent(params.po_id)}`, baseUrl)
  );
}

export async function PATCH(req: Request, { params }: { params: { po_id: string } }) {
  // Redirecionar para nova API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return NextResponse.redirect(
    new URL(`/api/mm/purchase-orders/${encodeURIComponent(params.po_id)}`, baseUrl)
  );
}

export async function DELETE(_: Request, { params }: { params: { po_id: string } }) {
  // Redirecionar para nova API
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return NextResponse.redirect(
    new URL(`/api/mm/purchase-orders/${encodeURIComponent(params.po_id)}`, baseUrl)
  );
}