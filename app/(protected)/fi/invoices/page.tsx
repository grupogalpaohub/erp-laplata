import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { redirect } from 'next/navigation'
import { Invoice } from '@/lib/schemas/fi'

export const dynamic = 'force-dynamic';

export default async function InvoicesPage() {
  const supabase = supabaseServer()
  
  try {
    const tenantId = await requireTenantId()
    
    const { data: invoices, error } = await supabase
      .from('fi_invoice')
      .select(`
        *,
        crm_customer:customer_id(customer_name, email),
        mm_vendor:vendor_id(vendor_name, email)
      `)
      .eq('tenant_id', tenantId)
      .order('invoice_date', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error loading invoices:', error)
      redirect('/fi')
    }

    const getStatusColor = (invoice: Invoice) => {
      if (!invoice.due_date) return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      
      const today = new Date()
      const dueDate = new Date(invoice.due_date)
      
      if (dueDate < today) {
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      } else {
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      }
    }

    const getStatusText = (invoice: Invoice) => {
      if (!invoice.due_date) return 'Sem vencimento'
      
      const today = new Date()
      const dueDate = new Date(invoice.due_date)
      
      if (dueDate < today) {
        return 'Vencida'
      } else {
        return 'Em dia'
      }
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Faturas
          </h1>
        </div>

        {/* Invoices Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Cliente/Fornecedor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Vencimento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {invoices?.map((invoice: Invoice & { 
                  crm_customer?: any,
                  mm_vendor?: any 
                }) => (
                  <tr key={invoice.invoice_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {invoice.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {invoice.crm_customer?.customer_name || invoice.mm_vendor?.vendor_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {invoice.crm_customer?.email || invoice.mm_vendor?.email || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(invoice.invoice_date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString('pt-BR') : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      R$ {(invoice.total_amount_cents / 100).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(invoice)}`}>
                        {getStatusText(invoice)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!invoices || invoices.length === 0) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma fatura encontrada</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              As faturas aparecerão aqui quando forem emitidas.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading invoices page:', error)
    redirect('/login')
  }
}
