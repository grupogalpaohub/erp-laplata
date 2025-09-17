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
      const { vendor_id, po_date, expected_delivery, notes, items } = body

      // Generate PO number
      const { data: poNumber, error: poError } = await supabaseClient
        .rpc('next_doc_number', { p_tenant_id: tenantId, p_doc_type: 'MM' })

      if (poError) {
        return new Response(
          JSON.stringify({ ok: false, error: poError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create purchase order
      const { data: po, error: poCreateError } = await supabaseClient
        .from('mm_purchase_order')
        .insert({
          tenant_id: tenantId,
          mm_order: poNumber,
          vendor_id,
          po_date,
          expected_delivery,
          notes,
          status: 'draft'
        })
        .select()
        .single()

      if (poCreateError) {
        return new Response(
          JSON.stringify({ ok: false, error: poCreateError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      // Create purchase order items
      const poItems = items.map((item: any) => ({
        tenant_id: tenantId,
        mm_order: poNumber,
        plant_id: item.plant_id,
        mm_material: item.mm_material,
        mm_qtt: item.mm_qtt,
        unit_cost_cents: item.unit_cost_cents,
        line_total_cents: item.mm_qtt * item.unit_cost_cents,
        notes: item.notes
      }))

      const { data: itemsData, error: itemsError } = await supabaseClient
        .from('mm_purchase_order_item')
        .insert(poItems)
        .select()

      if (itemsError) {
        return new Response(
          JSON.stringify({ ok: false, error: itemsError.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ 
          ok: true, 
          data: { 
            po, 
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