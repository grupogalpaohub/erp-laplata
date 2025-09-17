import { createClient } from '@supabase/supabase-js'

// Only create client on the client side with valid URLs
let supabase: any = null

if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Only create client if we have valid environment variables
  if (supabaseUrl && supabaseAnonKey && 
      supabaseUrl.startsWith('https://') && 
      supabaseAnonKey.length > 10) {
    try {
      supabase = createClient(supabaseUrl, supabaseAnonKey)
    } catch (error) {
      console.warn('Failed to create Supabase client:', error)
      supabase = null
    }
  }
}

export { supabase }