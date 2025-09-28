import { supabaseServer } from '@/utils/supabase/server'
import { requireSession } from '@/lib/auth/requireSession'

export default async function WhoAmI() {
  await requireSession()
  const supabase = supabaseServer()
  
  const { data: { user }, error } = await supabase.auth.getUser()

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Who Am I</h1>
      <pre className="bg-gray-100 p-4 rounded mt-4">
        {JSON.stringify({ user, error }, null, 2)}
      </pre>
    </div>
  );
}

