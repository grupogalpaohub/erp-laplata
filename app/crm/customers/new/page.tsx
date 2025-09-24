import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { ArrowLeft } from 'lucide-react'
import NewCustomerForm from './NewCustomerForm'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function NewCustomerPage() {
  return (
    <div className="container-fiori">
      <div className="mb-6">
        <Link 
          href="/crm/customers" 
          className="btn-fiori-outline inline-flex items-center gap-2 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Clientes
        </Link>
        <h1 className="text-3xl font-bold text-fiori-text-primary">
          Novo Cliente
        </h1>
        <p className="text-fiori-text-secondary mt-2">
          Cadastre um novo cliente no sistema
        </p>
      </div>

      <NewCustomerForm />
    </div>
  )
}
