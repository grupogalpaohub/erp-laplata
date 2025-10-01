import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function GET() {
  const supabase = supabaseServer();

  // Se quiser filtrar por tenant, ajuste aqui
  const tenant = 'LaplataLunaria';

  const { data, error } = await supabase
    .from('crm_customer')
    .select('customer_id, name, email, telefone, contact_phone, customer_type, created_date')
    .eq('tenant_id', tenant)
    .order('name', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message, code: error.code }, { status: 500 });
  }
  return NextResponse.json(data ?? [], { status: 200 });
}
