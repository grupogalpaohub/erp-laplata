import { NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'

// Forçar Node.js runtime para APIs que usam Supabase
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: Request) {
  const supabase = supabaseServer()
  try {
    const tenantId = await requireTenantId()
    const { searchParams } = new URL(request.url)
    const customer_id = searchParams.get('customer_id')
    const vendor_id = searchParams.get('vendor_id')
    const status = searchParams.get('status') // paid, unpaid, overdue
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('fi_invoice')
      .select(`
        *,
        crm_customer:customer_id(name, email),
        mm_vendor:vendor_id(vendor_name, email)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('invoice_date', { ascending: false })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (customer_id) {
      query = query.eq('customer_id', customer_id)
    }
    if (vendor_id) {
      query = query.eq('vendor_id', vendor_id)
    }

    // Filtro de status baseado na data de vencimento
    if (status) {
      const today = new Date().toISOString().split('T')[0]
      switch (status) {
        case 'paid':
          // Assumindo que faturas pagas têm uma data de pagamento
          // Como não temos esse campo, vamos filtrar por data de vencimento passada
          query = query.lt('due_date', today)
          break
        case 'unpaid':
          query = query.gte('due_date', today)
          break
        case 'overdue':
          query = query.lt('due_date', today)
          break
      }
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching invoices:', error)
      return NextResponse.json({ 
        ok: false, 
        error: { code: error.code, message: error.message } 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      ok: true, 
      data: data || [], 
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit)
      }
    })
  } catch (error: any) {
    console.error('Unhandled error in GET /api/fi/invoices:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
