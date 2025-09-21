import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createSupabaseServerClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    const supabaseClient = createSupabaseServerClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { vendor_id, items, notes } = await req.json()

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

    const tenantId = user.user_metadata?.tenant_id || 'LaplataLunaria'

    // Generate PO number
    const { data: poNumber, error: poError } = await supabaseClient
      .rpc('next_doc_number', { p_tenant: tenantId, p_doc_type: 'MM' })

    if (poError) throw poError

    // Create purchase order
    const poData = {
      po_id: poNumber,
      tenant_id: tenantId,
      vendor_id,
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
      status: 'draft',
      total_amount: 0,
      currency: 'BRL',
      notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    const { data: po, error: poInsertError } = await supabaseClient
      .from('mm_purchase_order')
      .insert(poData)
      .select()
      .single()

    if (poInsertError) throw poInsertError

    // Create purchase order items
    const poItems = items.map((item: any, index: number) => ({
      item_id: `POI${String(index + 1).padStart(3, '0')}`,
      tenant_id: tenantId,
      po_id: poNumber,
      sku: item.sku,
      quantity: item.quantity,
      unit_price: item.unit_price,
      currency: 'BRL',
      notes: item.notes,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    const { data: itemsData, error: itemsError } = await supabaseClient
      .from('mm_purchase_order_item')
      .insert(poItems)
      .select()

    if (itemsError) throw itemsError

    // Get updated PO with total
    const { data: updatedPO, error: fetchError } = await supabaseClient
      .from('mm_purchase_order')
      .select('*')
      .eq('po_id', poNumber)
      .eq('tenant_id', tenantId)
      .single()

    if (fetchError) throw fetchError

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          po: updatedPO,
          items: itemsData
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    )

  } catch (error) {
    console.error('PO create error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
