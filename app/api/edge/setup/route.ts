import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// IMPORTANTE: runtime Node (não edge) para acesso a env segura
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    const urlObj = new URL(req.url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const module = pathParts[3]; // /api/edge/setup/:module

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata');
    }

    return await handleGet(admin, module, tenantId);

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    const urlObj = new URL(req.url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const module = pathParts[3]; // /api/edge/setup/:module
    const entity = pathParts[4]; // /api/edge/setup/:module/def/:entity

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata');
    }

    return await handlePost(admin, module, entity, tenantId, req);

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    const urlObj = new URL(req.url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const module = pathParts[3]; // /api/edge/setup/:module
    const entity = pathParts[4]; // /api/edge/setup/:module/def/:entity

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata');
    }

    return await handlePut(admin, module, entity, tenantId, req);

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    const urlObj = new URL(req.url);
    const pathParts = urlObj.pathname.split('/').filter(Boolean);
    const module = pathParts[3]; // /api/edge/setup/:module
    const entity = pathParts[4]; // /api/edge/setup/:module/def/:entity

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header required');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token');
    }

    const tenantId = user.user_metadata?.tenant_id;
    if (!tenantId) {
      throw new Error('tenant_id not found in user metadata');
    }

    return await handleDelete(admin, module, entity, tenantId, req);

  } catch (error: any) {
    console.error('Setup error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}

async function handleGet(supabaseClient: any, module: string, tenantId: string) {
  const setupTable = `${module}_setup`;
  const defTables = getDefTables(module);

  // Get setup data
  const { data: setup, error: setupError } = await supabaseClient
    .from(setupTable)
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  if (setupError && setupError.code !== 'PGRST116') {
    throw setupError;
  }

  // Get definitions
  const defs: any = {};
  for (const defTable of defTables) {
    const { data, error } = await supabaseClient
      .from(defTable)
      .select('*')
      .eq('tenant_id', tenantId)
      .order('created_at');

    if (!error) {
      defs[defTable] = data || [];
    }
  }

  return NextResponse.json({ setup, defs });
}

async function handlePost(supabaseClient: any, module: string, entity: string | undefined, tenantId: string, req: Request) {
  const body = await req.json();

  if (entity) {
    // Handle definition creation
    const defTable = `${module}_${entity}_def`;
    const record = { ...body, tenant_id: tenantId };
    
    const { data, error } = await supabaseClient
      .from(defTable)
      .insert(record)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data }, { status: 201 });
  } else {
    // Handle setup upsert
    const setupTable = `${module}_setup`;
    const record = { ...body, tenant_id: tenantId };
    
    const { data, error } = await supabaseClient
      .from(setupTable)
      .upsert(record, { onConflict: 'tenant_id' })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  }
}

async function handlePut(supabaseClient: any, module: string, entity: string | undefined, tenantId: string, req: Request) {
  if (!entity) {
    throw new Error('Entity required for PUT');
  }

  const body = await req.json();
  const defTable = `${module}_${entity}_def`;
  const { id, ...updateData } = body;

  const { data, error } = await supabaseClient
    .from(defTable)
    .update(updateData)
    .eq('id', id)
    .eq('tenant_id', tenantId)
    .select()
    .single();

  if (error) throw error;

  return NextResponse.json({ success: true, data });
}

async function handleDelete(supabaseClient: any, module: string, entity: string | undefined, tenantId: string, req: Request) {
  if (!entity) {
    throw new Error('Entity required for DELETE');
  }

  const urlObj = new URL(req.url);
  const id = urlObj.searchParams.get('id');

  if (!id) {
    throw new Error('ID required for DELETE');
  }

  const defTable = `${module}_${entity}_def`;

  const { error } = await supabaseClient
    .from(defTable)
    .delete()
    .eq('id', id)
    .eq('tenant_id', tenantId);

  if (error) throw error;

  return NextResponse.json({ success: true });
}

function getDefTables(module: string): string[] {
  const defTablesMap: { [key: string]: string[] } = {
    'mm': ['mm_category_def', 'mm_classification_def', 'mm_currency_def', 'mm_vendor_rating_def', 'mm_status_def'],
    'wh': ['wh_inventory_status_def'],
    'sd': ['sd_order_status_def', 'sd_shipment_status_def', 'sd_carrier_def', 'sd_channel_def'],
    'crm': ['crm_source_def', 'crm_lead_status_def', 'crm_opp_stage_def'],
    'fi': ['fi_payment_method_def', 'fi_payment_terms_def', 'fi_tax_code_def'],
    'co': ['co_kpi_definition']
  };

  return defTablesMap[module] || [];
}
