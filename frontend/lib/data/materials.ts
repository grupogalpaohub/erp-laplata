// lib/data/materials.ts
'use server';

import { supabaseServer } from '@/lib/supabase/server';

export type MaterialRow = {
  tenant_id: string;
  mm_material: string;          // código do material (texto)
  commercial_name?: string | null;  // pode existir no snapshot
  mm_comercial?: string | null;     // compatibilidade com o código anterior
  mm_desc?: string | null;
  mm_mat_type: string;          // enums reais no banco, tipar como string aqui
  mm_mat_class: string;
  mm_price_cents: number | null;
  status: string | null;
};

export async function getMaterials(limit = 300): Promise<MaterialRow[]> {
  const sb = supabaseServer();
  const tenant = process.env.TENANT_ID!; // ex.: LaplataLunaria

  const { data, error } = await sb
    .from('mm_material')
    .select(`
      tenant_id,
      mm_material,
      commercial_name,
      mm_comercial,
      mm_desc,
      mm_mat_type,
      mm_mat_class,
      mm_price_cents,
      status
    `)
    .eq('tenant_id', tenant)
    .order('mm_material', { ascending: true })
    .limit(limit);

  if (error) {
    // Não vazar detalhes; log opcional no server
    console.error('getMaterials error:', error);
    return [];
  }
  return data ?? [];
}