import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST() {
  try {
    const supabase = getSupabaseServerClient();
    
    // Tentar inserir um cliente de teste
    const { data, error } = await supabase
      .from('crm_customer')
      .insert({
        name: 'Cliente Teste RLS',
        customer_type: 'PF',
        contact_email: 'teste@rls.com',
        document_no: '123.456.789-00',
        contact_phone: '(11) 99999-9999',
        status: 'active'
      })
      .select('customer_id')
      .single();

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        code: error.code 
      });
    }

    return NextResponse.json({ 
      success: true, 
      customer_id: data?.customer_id 
    });
  } catch (e: any) {
    return NextResponse.json({ 
      success: false, 
      error: e?.message ?? "Erro inesperado" 
    }, { status: 500 });
  }
}
