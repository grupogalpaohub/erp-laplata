import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(token)
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ ok: false, error: 'Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { data: profile, error: profileError } = await supabaseClient
      .from('user_profile')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single()

    if (profileError || !profile) {
      return new Response(
        JSON.stringify({ ok: false, error: 'User profile not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const tenantId = profile.tenant_id

    if (req.method === 'POST') {
      const body = await req.json()
      const { customer_id, order_date, expected_ship, items } = body

      // Generate SO number
      const { data: soNumber, error: soError } = await supabaseClient
        .rpc('next_doc_number', { p_tenant_id: tenantId, p_doc_type: 'SO' })

      if (soError) {
        return new Response(
          JSON.stringify({ ok: false, error: soError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create sales order
      const { data: so, error: soCreateError } = await supabaseClient
        .from('sd_sales_order')
        .insert({
          tenant_id: tenantId,
          so_id: soNumber,
          customer_id,
          order_date,
          expected_ship,
          status: 'draft',
          total_cents: 0 // Will be calculated by trigger
        })
        .select()
        .single()

      if (soCreateError) {
        return new Response(
          JSON.stringify({ ok: false, error: soCreateError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create sales order items
      const soItems = items.map((item: any, index: number) => ({
        tenant_id: tenantId,
        so_id: soNumber,
        sku: item.sku,
        quantity: item.quantity,
        unit_price_cents: item.unit_price_cents,
        line_total_cents: item.quantity * item.unit_price_cents,
        row_no: index + 1
      }))

      const { data: itemsData, error: itemsError } = await supabaseClient
        .from('sd_sales_order_item')
        .insert(soItems)
        .select()

      if (itemsError) {
        return new Response(
          JSON.stringify({ ok: false, error: itemsError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Get updated sales order with calculated total
      const { data: updatedSo, error: updateError } = await supabaseClient
        .from('sd_sales_order')
        .select('*')
        .eq('so_id', soNumber)
        .single()

      if (updateError) {
        return new Response(
          JSON.stringify({ ok: false, error: updateError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          ok: true, 
          data: { 
            so: updatedSo, 
            items: itemsData 
          } 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ ok: false, error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ ok: false, error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})