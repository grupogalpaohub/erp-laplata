import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database
export interface Database {
  public: {
    Tables: {
      tenant: {
        Row: {
          tenant_id: string
          display_name: string
          locale: string
          timezone: string
          created_at: string
        }
        Insert: {
          tenant_id: string
          display_name: string
          locale: string
          timezone: string
          created_at?: string
        }
        Update: {
          tenant_id?: string
          display_name?: string
          locale?: string
          timezone?: string
          created_at?: string
        }
      }
      user_profile: {
        Row: {
          tenant_id: string
          user_id: string
          name: string
          email: string
          role: string
          is_active: boolean
          created_at: string
        }
        Insert: {
          tenant_id: string
          user_id: string
          name: string
          email: string
          role: string
          is_active?: boolean
          created_at?: string
        }
        Update: {
          tenant_id?: string
          user_id?: string
          name?: string
          email?: string
          role?: string
          is_active?: boolean
          created_at?: string
        }
      }
      // Add other table types as needed
    }
  }
}