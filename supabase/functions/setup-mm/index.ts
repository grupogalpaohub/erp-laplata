import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createSupabaseServerClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key
    const supabaseClient = createSupabaseServerClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get tenant_id from JWT
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

    // Get user profile to get tenant_id
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

    if (req.method === 'GET') {
      // Get MM setup and definitions
      const [setupResult, categoryResult, classificationResult, currencyResult, ratingResult, statusResult] = await Promise.all([
        supabaseClient.from('mm_setup').select('*').eq('tenant_id', tenantId).single(),
        supabaseClient.from('mm_category_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
        supabaseClient.from('mm_classification_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
        supabaseClient.from('mm_currency_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
        supabaseClient.from('mm_vendor_rating_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
        supabaseClient.from('mm_status_def').select('*').eq('tenant_id', tenantId)
      ])

      return new Response(
        JSON.stringify({
          ok: true,
          data: {
            setup: setupResult.data,
            defs: {
              categories: categoryResult.data,
              classifications: classificationResult.data,
              currencies: currencyResult.data,
              ratings: ratingResult.data,
              statuses: statusResult.data
            }
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (req.method === 'POST') {
      // Update MM setup
      const body = await req.json()
      const { setup } = body

      const { data, error } = await supabaseClient
        .from('mm_setup')
        .upsert({
          tenant_id: tenantId,
          ...setup
        })
        .select()
        .single()

      if (error) {
        return new Response(
          JSON.stringify({ ok: false, error: error.message }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
      }

      return new Response(
        JSON.stringify({ ok: true, data }),
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
