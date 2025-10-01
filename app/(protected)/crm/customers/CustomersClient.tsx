'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Eye } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

export function CustomersClient() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCustomers()
  }, [])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError('')

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      // Tentar buscar dados sem filtro de tenant_id primeiro
      const { data, error } = await supabase
        .from('crm_customer')
        .select('customer_id, name, email, telefone, contact_phone, customer_type, created_date')
        .order('name')

      if (error) {
        console.error('Error fetching customers:', error)
        setError('Erro ao carregar clientes: ' + error.message)
      } else {
        // Filtrar client-side por tenant_id se necessário
        const filteredData = (data || []).filter(customer => 
          customer.tenant_id === 'LaplataLunaria' || !customer.tenant_id
        )
        setCustomers(filteredData)
      }
    } catch (err: any) {
      console.error('Error in fetchCustomers:', err)
      setError('Erro ao carregar clientes: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
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
          <div className="card-fiori-body">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-fiori-primary mx-auto mb-4"></div>
                <p className="text-fiori-text-secondary">Carregando clientes...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
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
        <div className="card-fiori-body">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="table-fiori">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>E-MAIL</th>
                  <th>TELEFONE</th>
                  <th>TIPO</th>
                  <th>DATA DE CADASTRO</th>
                  <th>AÇÕES</th>
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
                      <td>{customer.email}</td>
                      <td>{customer.contact_phone || customer.telefone || '-'}</td>
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
                        {new Date(customer.created_date).toLocaleDateString('pt-BR')}
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
