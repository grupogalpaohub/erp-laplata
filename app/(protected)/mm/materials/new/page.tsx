import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireTenantId } from '@/utils/tenant'
import { redirect } from 'next/navigation'
import { CreateMaterialForm } from './CreateMaterialForm'

export default async function NewMaterialPage() {
  const supabase = supabaseServerReadOnly()
  
  try {
    const tenantId = await requireTenantId()
    
    // Buscar fornecedores para o select
    const { data: vendors, error: vendorsError } = await supabase
      .from('mm_vendor')
      .select('vendor_id, vendor_name')
      .eq('tenant_id', tenantId)
      .order('vendor_name', { ascending: true })

    if (vendorsError) {
      console.error('Error loading vendors:', vendorsError)
      redirect('/mm/materials')
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center space-x-4">
          <a
            href="/mm/materials"
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </a>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Novo Material
          </h1>
        </div>

        <CreateMaterialForm vendors={vendors || []} />
      </div>
    )
  } catch (error) {
    console.error('Error loading new material page:', error)
    redirect('/login')
  }
}

