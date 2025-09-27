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

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        ok: false,
        error: 'Missing authorization header'
      }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    // Get user profile to get tenant_id
    const { data: profile, error: profileError } = await admin
      .from('user_profile')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({
        ok: false,
        error: 'User profile not found'
      }, { status: 404 });
    }

    const tenantId = profile.tenant_id;

    // Get MM setup and definitions
    const [setupResult, categoryResult, classificationResult, currencyResult, ratingResult, statusResult] = await Promise.all([
      admin.from('mm_setup').select('*').eq('tenant_id', tenantId).single(),
      admin.from('mm_category_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
      admin.from('mm_classification_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
      admin.from('mm_currency_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
      admin.from('mm_vendor_rating_def').select('*').eq('tenant_id', tenantId).eq('is_active', true),
      admin.from('mm_status_def').select('*').eq('tenant_id', tenantId)
    ]);

    return NextResponse.json({
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
    });

  } catch (error: any) {
    console.error('Setup MM error:', error);
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const svc = process.env.SUPABASE_SERVICE_ROLE_KEY!; // server-only

    const admin = createClient(url, svc, { auth: { persistSession: false } });

    // Get tenant_id from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({
        ok: false,
        error: 'Missing authorization header'
      }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await admin.auth.getUser(token);
    
    if (authError || !user) {
      return NextResponse.json({
        ok: false,
        error: 'Invalid token'
      }, { status: 401 });
    }

    // Get user profile to get tenant_id
    const { data: profile, error: profileError } = await admin
      .from('user_profile')
      .select('tenant_id')
      .eq('user_id', user.id)
      .single();

    if (profileError || !profile) {
      return NextResponse.json({
        ok: false,
        error: 'User profile not found'
      }, { status: 404 });
    }

    const tenantId = profile.tenant_id;

    // Update MM setup
    const body = await req.json();
    const { setup } = body;

    const { data, error } = await admin
      .from('mm_setup')
      .upsert({
        tenant_id: tenantId,
        ...setup
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({
        ok: false,
        error: error.message
      }, { status: 400 });
    }

    return NextResponse.json({ ok: true, data });

  } catch (error: any) {
    console.error('Setup MM error:', error);
    return NextResponse.json({
      ok: false,
      error: error.message
    }, { status: 500 });
  }
}
