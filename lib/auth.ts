import { getSupabaseServerClient } from '@/utils/supabase/server';
import { ENV } from '@/lib/env';

export async function getTenantId() {
  if (ENV.AUTH_DISABLED) {
    return process.env.TENANT_ID || 'default';
  }
  
  try {
    const supabase = getSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || process.env.TENANT_ID || 'default';
  } catch (error) {
    console.warn('Auth error, using default tenant:', error);
    return process.env.TENANT_ID || 'default';
  }
}

