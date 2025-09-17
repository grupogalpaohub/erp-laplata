'use client'

import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

export function AuthDebug() {
  const { user, session, loading } = useAuth()

  const testSupabaseConnection = async () => {
    if (!supabase) {
      console.log('❌ Supabase client not initialized')
      return
    }

    try {
      const { data, error } = await supabase.auth.getSession()
      console.log('✅ Supabase connection test:', { data, error })
    } catch (err) {
      console.log('❌ Supabase connection error:', err)
    }
  }

  const testGoogleAuth = async () => {
    if (!supabase) {
      console.log('❌ Supabase client not initialized')
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/dashboard',
        },
      })
      console.log('✅ Google auth test:', { data, error })
    } catch (err) {
      console.log('❌ Google auth error:', err)
    }
  }

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
      <h3 className="font-semibold text-yellow-800 mb-2">Auth Debug</h3>
      <div className="space-y-2 text-sm">
        <p><strong>Loading:</strong> {loading ? 'Yes' : 'No'}</p>
        <p><strong>User:</strong> {user ? user.email : 'None'}</p>
        <p><strong>Session:</strong> {session ? 'Active' : 'None'}</p>
        <p><strong>Supabase URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL}</p>
        <p><strong>Supabase Key:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}</p>
        
        <div className="flex space-x-2 mt-4">
          <button
            onClick={testSupabaseConnection}
            className="px-3 py-1 bg-blue-500 text-white rounded text-xs"
          >
            Test Supabase
          </button>
          <button
            onClick={testGoogleAuth}
            className="px-3 py-1 bg-green-500 text-white rounded text-xs"
          >
            Test Google Auth
          </button>
        </div>
      </div>
    </div>
  )
}