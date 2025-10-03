import { ENV } from '@/lib/env';
import { supabaseServer } from '@/lib/supabase/server';

export async function getUserServer() {
  if (ENV.AUTH_DISABLED) {
    return {
      id: 'dev-user',
      email: 'dev@local',
      user_metadata: { name: 'Dev User', role: 'ADMIN' },
    };
  }
  
  try {
    const supabase = supabaseServer();
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('getUserServer error:', error);
      return null;
    }
    
    return user ?? null;
  } catch (error) {
    console.error('getUserServer catch error:', error);
    return null;
  }
}

