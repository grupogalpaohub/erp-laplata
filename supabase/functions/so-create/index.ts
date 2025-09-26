import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { getSupabaseServerClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  try {
    const supabaseClient = getSupabaseServerClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { customer_id, items, notes, channel = 'site' } = await req.json()

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('Authorization header required')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid token')
    }

    const tenantId = user.user_metadata?.tenant_id
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata')
    }

    // Generate SO number
    const { data: soNumber, error: soError } = await supabaseClient
      .rpc('next_doc_number', { p_tenant: tenantId, p_doc_type: 'SO' })

    if (soError) throw soError

    // Create sales order
    const soData = {
      so_id: soNumber,
      tenant_id: tenantId,
      customer_id,
      order_date: new Date().toISOString().split('T')[0],
      status: 'draft',
      total_amount: 0,
      currency: 'BRL',
      channel,
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: so, error: soInsertError } = await supabaseClient
      .from('sd_sales_order')
      .insert(soData)
      .select()
      .single()

    if (soInsertError) throw soInsertError

    // Create sales order items
    const soItems = items.map((item: any, index: number) => ({
      item_id: `SOI${String(index + 1).padStart(3, '0')}`,
      tenant_id: tenantId,
      so_id: soNumber,
      sku: item.sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency: 'BRL',
      notes: item.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data: itemsData, error: itemsError } = await supabaseClient
      .from('sd_sales_order_item')
      .insert(soItems)
      .select()

    if (itemsError) throw itemsError

    // Get updated SO with total
    const { data: updatedSO, error: fetchError } = await supabaseClient
      .from('sd_sales_order')
      .select('*')
      .eq('so_id', soNumber)
      .eq('tenant_id', tenantId)
      .single()

    if (fetchError) throw fetchError

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          so: updatedSO,
          items: itemsData
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    )

  } catch (error) {
    console.error('SO create error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

