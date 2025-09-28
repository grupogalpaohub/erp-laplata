import { supabaseServer } from '@/lib/supabase/server';
export async function fetchMaterials(limit = 100) {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("mm_material")
    .select("*")
    .order("mm_material", { ascending: true })
    .limit(limit);
  if (error) throw new Error(error.message);
  return data ?? [];
}
