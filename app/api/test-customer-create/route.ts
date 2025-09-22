import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'

export async function POST(request: NextRequest) {
  try {
    console.log('=== TESTE DE CRIAÇÃO DE CLIENTE ===')
    
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()
    
    console.log('Tenant ID:', tenantId)
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service Role Key presente:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
    
    const body = await request.json()
    console.log('Dados recebidos:', body)

    // Gerar ID único para o cliente
    const customerId = `CUST-${Date.now()}`
    console.log('Customer ID gerado:', customerId)

    // Criar cliente com dados básicos
    const customerData = {
      tenant_id: tenantId,
      customer_id: customerId,
      name: body.name || 'Eduardo J.',
      contact_email: body.contact_email || 'teste@cliente.com',
      contact_phone: body.contact_phone || '99999999999',
      phone_country: body.phone_country || 'BR',
      document_id: body.document_id || '00000000000',
      addr_street: body.addr_street || 'Rua Qualquer',
      addr_number: body.addr_number || '1',
      addr_complement: body.addr_complement || '',
      addr_district: body.addr_district || 'Centro',
      addr_city: body.addr_city || 'Rio de Janeiro',
      addr_state: body.addr_state || 'RJ',
      addr_zip: body.addr_zip || '00000000',
      addr_country: body.addr_country || 'BR',
      contact_name: body.contact_name || 'Eduardo J.F.',
      is_active: true,
      customer_type: body.customer_type || 'PF',
      created_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }

    console.log('Dados do cliente para inserir:', customerData)

    // Testar conexão com Supabase
    const { data: testData, error: testError } = await supabase
      .from('crm_customer')
      .select('count')
      .eq('tenant_id', tenantId)
      .limit(1)

    if (testError) {
      console.error('Erro ao testar conexão:', testError)
      return NextResponse.json({ 
        error: 'Erro de conexão com banco de dados',
        details: testError
      }, { status: 500 })
    }

    console.log('Conexão com banco OK. Contagem atual:', testData)

    // Inserir cliente
    const { data, error } = await supabase
      .from('crm_customer')
      .insert([customerData])
      .select('customer_id')
      .single()

    if (error) {
      console.error('Erro ao inserir cliente:', error)
      return NextResponse.json({ 
        error: `Erro ao criar cliente: ${error.message}`,
        details: error,
        code: error.code
      }, { status: 500 })
    }

    console.log('Cliente criado com sucesso:', data)

    // Verificar se o cliente foi realmente criado
    const { data: verifyData, error: verifyError } = await supabase
      .from('crm_customer')
      .select('*')
      .eq('customer_id', customerId)
      .single()

    if (verifyError) {
      console.error('Erro ao verificar cliente criado:', verifyError)
    } else {
      console.log('Cliente verificado no banco:', verifyData)
    }

    return NextResponse.json({ 
      success: true, 
      customer_id: data.customer_id,
      message: 'Cliente criado com sucesso',
      verification: verifyData
    })

  } catch (error) {
    console.error('Erro inesperado:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
}
