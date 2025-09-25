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

  try {
    const supabaseClient = getSupabaseServerClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url)
    const pathParts = url.pathname.split('/').filter(Boolean)
    const module = pathParts[2] // /setup/:module
    const entity = pathParts[3] // /setup/:module/def/:entity

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

    // Get tenant_id from user metadata or default
    const tenantId = user.user_metadata?.tenant_id || 'LaplataLunaria'

    if (req.method === 'GET') {
      return await handleGet(supabaseClient, module, tenantId)
    } else if (req.method === 'POST') {
      return await handlePost(supabaseClient, module, entity, tenantId, req)
    } else if (req.method === 'PUT') {
      return await handlePut(supabaseClient, module, entity, tenantId, req)
    } else if (req.method === 'DELETE') {
      return await handleDelete(supabaseClient, module, entity, tenantId, req)
    }

    throw new Error('Method not allowed')

  } catch (error) {
    console.error('Setup error:', error)
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})

async function handleGet(supabaseClient: any, module: string, tenantId: string) {
  const setupTable = `${module}_setup`
  const defTables = getDefTables(module)

  // Get setup data
  const { data: setup, error: setupError } = await supabaseClient
    .from(setupTable)
    .select('*')
    .eq('tenant_id', tenantId)
    .single()

  if (setupError && setupError.code !== 'PGRST116') {
    throw setupError
  }

  // Get definitions
  const defs: any = {}
  for (const defTable of defTables) {
    const { data, error } = await supabaseClient
      .from(defTable)
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at')

    if (!error) {
      defs[defTable] = data || []
    }
  }

  return new Response(
    JSON.stringify({ setup, defs }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handlePost(supabaseClient: any, module: string, entity: string | undefined, tenantId: string, req: Request) {
  const body = await req.json()

  if (entity) {
    // Handle definition creation
    const defTable = `${module}_${entity}_def`
    const record = { ...body, tenant_id: tenantId }
    
    const { data, error } = await supabaseClient
      .from(defTable)
      .insert(record)
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 201 }
    )
  } else {
    // Handle setup upsert
    const setupTable = `${module}_setup`
    const record = { ...body, tenant_id: tenantId }
    
    const { data, error } = await supabaseClient
      .from(setupTable)
      .upsert(record, { onConflict: 'tenant_id' })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  }
}

async function handlePut(supabaseClient: any, module: string, entity: string | undefined, tenantId: string, req: Request) {
  if (!entity) {
    throw new Error('Entity required for PUT')
  }

  const body = await req.json()
  const defTable = `${module}_${entity}_def`
  const { id, ...updateData } = body

  const { data, error } = await supabaseClient
    .from(defTable)
    .update(updateData)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single()

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

async function handleDelete(supabaseClient: any, module: string, entity: string | undefined, tenantId: string, req: Request) {
  if (!entity) {
    throw new Error('Entity required for DELETE')
  }

  const url = new URL(req.url)
  const id = url.searchParams.get('id')

  if (!id) {
    throw new Error('ID required for DELETE')
  }

  const defTable = `${module}_${entity}_def`

  const { error } = await supabaseClient
    .from(defTable)
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId)

  if (error) throw error

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
  )
}

function getDefTables(module: string): string[] {
  const defTablesMap: { [key: string]: string[] } = {
    'mm': ['mm_category_def', 'mm_classification_def', 'mm_currency_def', 'mm_vendor_rating_def', 'mm_status_def'],
    'wh': ['wh_inventory_status_def'],
    'sd': ['sd_order_status_def', 'sd_shipment_status_def', 'sd_carrier_def', 'sd_channel_def'],
    'crm': ['crm_source_def', 'crm_lead_status_def', 'crm_opp_stage_def'],
    'fi': ['fi_payment_method_def', 'fi_payment_terms_def', 'fi_tax_code_def'],
    'co': ['co_kpi_definition']
  }

  return defTablesMap[module] || []
}

