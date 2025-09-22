import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('mm_vendor')
      .select('*')
      .eq('tenant_id', tenantId)
      .order('vendor_name')

    if (error) {
      console.error('Error fetching vendors:', error)
      return NextResponse.json({ error: 'Erro ao buscar fornecedores' }, { status: 500 })
    }

    return NextResponse.json(data || [])

  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const body = await request.json()
    const { 
      vendor_name, 
      tax_id, 
      email, 
      telefone, 
      contact_person, 
      rating, 
      address, 
      city, 
      state, 
      zip_code, 
      country, 
      payment_terms 
    } = body

    if (!vendor_name || !tax_id || !email) {
      return NextResponse.json({ error: 'Nome, documento e email são obrigatórios' }, { status: 400 })
    }

    const vendorData = {
      tenant_id: tenantId,
      vendor_id: `V${Date.now()}`, // ID simples baseado em timestamp
      vendor_name,
      email,
      telefone: telefone || null,
      cidade: city, // Mapear city para cidade
      estado: state, // Mapear state para estado
      contact_person: contact_person || null,
      address: address || null,
      city: city || null,
      state: state || null,
      zip_code: zip_code || null,
      country: country || 'Brasil',
      tax_id,
      payment_terms: payment_terms || 0, // PIX = 0
      rating: rating || 'A', // Excelente = A
      status: 'active'
    }

    const { data, error } = await supabase
      .from('mm_vendor')
      .insert([vendorData])
      .select('vendor_id')
      .single()

    if (error) {
      console.error('Error creating vendor:', error)
      return NextResponse.json({ error: `Erro ao criar fornecedor: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      vendor_id: data.vendor_id,
      message: 'Fornecedor criado com sucesso'
    })

  } catch (error) {
    console.error('Error creating vendor:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}