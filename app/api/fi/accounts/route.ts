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
    const account_type = searchParams.get('account_type')
    const parent_account_id = searchParams.get('parent_account_id')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '50')

    const offset = (page - 1) * limit

    let query = supabase
      .from('fi_account')
      .select(`
        *,
        parent_account:parent_account_id(account_code, account_name),
        child_accounts:fi_account!parent_account_id(account_code, account_name, account_type)
      `, { count: 'exact' })
      .eq('tenant_id', tenantId)
      .order('account_code', { ascending: true })
      .range(offset, offset + limit - 1)

    // Aplicar filtros
    if (account_type) {
      query = query.eq('account_type', account_type)
    }
    if (parent_account_id) {
      query = query.eq('parent_account_id', parent_account_id)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching accounts:', error)
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
    console.error('Unhandled error in GET /api/fi/accounts:', error)
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'UNHANDLED_ERROR', message: error.message } 
    }, { status: 500 })
  }
}
