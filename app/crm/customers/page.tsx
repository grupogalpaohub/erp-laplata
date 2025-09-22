import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { Plus, Edit, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

export default async function CustomersPage() {
  let customers: any[] = []

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    const { data, error } = await supabase
      .from('crm_customer')
      .select('customer_id, name, contact_email, contact_phone, customer_type, created_at')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('name')

    if (error) {
      console.error('Error fetching customers:', error)
    } else {
      customers = data || []
    }
  } catch (error) {
    console.error('Error in customers page:', error)
  }

  return (
    <div className="container-fiori">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold text-fiori-text-primary">
              Central de Clientes
            </h1>
            <p className="text-fiori-text-secondary mt-2">
              Gerencie clientes e informações de contato
            </p>
          </div>
          <Link
            href="/crm/customers/new"
            className="btn-fiori flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Novo Cliente
          </Link>
        </div>
      </div>

      <div className="card-fiori">
        <div className="card-fiori-content p-0">
          <div className="overflow-x-auto">
            <table className="table-fiori">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-mail</th>
                  <th>Telefone</th>
                  <th>Tipo</th>
                  <th>Data de Cadastro</th>
                  <th className="w-32">Ações</th>
                </tr>
              </thead>
              <tbody>
                {customers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-fiori-text-secondary">
                      Nenhum cliente cadastrado
                    </td>
                  </tr>
                ) : (
                  customers.map((customer) => (
                    <tr key={customer.customer_id}>
                      <td className="font-mono text-sm">{customer.customer_id}</td>
                      <td className="font-medium">{customer.name}</td>
                      <td>{customer.contact_email}</td>
                      <td>{customer.contact_phone || '-'}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          customer.customer_type === 'PF' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {customer.customer_type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        </span>
                      </td>
                      <td>
                        {new Date(customer.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <Link
                            href={`/crm/customers/${customer.customer_id}`}
                            className="btn-fiori-outline btn-sm"
                          >
                            <Eye className="w-3 h-3" />
                          </Link>
                          <Link
                            href={`/crm/customers/${customer.customer_id}/edit`}
                            className="btn-fiori-outline btn-sm"
                          >
                            <Edit className="w-3 h-3" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}