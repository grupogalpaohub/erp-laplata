import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const tenantId = await getTenantId()

    const { data: vendors, error } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name')
      .eq('tenant_id', tenantId)
      .order('vendor_name', { ascending: true })

    if (error) {
      console.error('Error fetching vendors:', error)
      return NextResponse.json({ 
        success: false, 
        error: error.message 
      }, { status: 500 })
    }

    return NextResponse.json(vendors || [])

  } catch (error) {
    console.error('Error fetching vendors:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }, { status: 500 })
  }
}
