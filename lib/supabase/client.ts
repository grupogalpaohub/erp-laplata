import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON } from "@/src/env";

// objeto (não é função)
export const supabaseBrowser = createClient(SUPABASE_URL, SUPABASE_ANON);