import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Testar inserção de cliente de teste simples
    const testCustomer = {
      tenant_id: 'LaplataLunaria',
      customer_id: 'TEST-' + Date.now(),
      name: 'Cliente Teste',
      contact_email: 'teste@exemplo.com',
      contact_phone: '11999999999',
      phone_country: 'BR',
      contact_name: 'Nome Contato',
      document_id: '12345678901',
      addr_street: 'Rua Teste',
      addr_number: '123',
      addr_complement: 'Apto 1',
      addr_district: 'Centro',
      addr_city: 'São Paulo',
      addr_state: 'SP',
      addr_zip: '01234567',
      addr_country: 'BR',
      is_active: true,
      customer_type: 'PF',
      created_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }

    console.log('Testando inserção de cliente:', testCustomer)

    const { data: insertData, error: insertError } = await supabase
      .from('crm_customer')
      .insert(testCustomer)
      .select('customer_id')
      .single()

    console.log('Resultado da inserção:', { insertData, insertError })

    // Limpar cliente de teste se foi inserido
    if (insertData) {
      await supabase
        .from('crm_customer')
        .delete()
        .eq('customer_id', insertData.customer_id)
    }

    return NextResponse.json({
      success: true,
      insertTest: {
        success: !insertError,
        error: insertError?.message,
        customerId: insertData?.customer_id,
        details: insertError
      },
      environment: {
        AUTH_DISABLED: process.env.AUTH_DISABLED,
        NEXT_PUBLIC_AUTH_DISABLED: process.env.NEXT_PUBLIC_AUTH_DISABLED,
        hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL
      }
    })

  } catch (error) {
    console.error('Erro no endpoint:', error)
    return NextResponse.json({ 
      error: 'Erro interno', 
      details: error instanceof Error ? error.message : 'Erro desconhecido',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
