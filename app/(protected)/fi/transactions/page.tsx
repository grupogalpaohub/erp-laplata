import { supabaseServerReadOnly } from '@/lib/supabase/server-readonly'
import { requireTenantId } from '@/utils/tenant'
import { redirect } from 'next/navigation'
import { Transaction } from '@/lib/schemas/fi'

export const dynamic = 'force-dynamic';

export default async function TransactionsPage() {
  const supabase = supabaseServerReadOnly()
  
  try {
    const tenantId = await requireTenantId()
    
    const { data: transactions, error } = await supabase
      .from('fi_transaction')
      .select(`
        *,
        fi_account:account_id(account_code, account_name, account_type)
      `)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (error) {
      console.error('Error loading transactions:', error)
      redirect('/fi')
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Transações Financeiras
          </h1>
        </div>

        {/* Transactions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Conta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Referência
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {transactions?.map((transaction: Transaction & { 
                  fi_account?: any 
                }) => (
                  <tr key={transaction.transaction_id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {new Date(transaction.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {transaction.fi_account?.account_name || 'N/A'}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {transaction.fi_account?.account_code || 'N/A'} - {transaction.fi_account?.account_type || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        transaction.type === 'credit' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                      }`}>
                        {transaction.type === 'credit' ? 'Crédito' : 'Débito'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm font-medium ${
                        transaction.type === 'credit' 
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-red-600 dark:text-red-400'
                      }`}>
                        {transaction.type === 'credit' ? '+' : '-'}R$ {(transaction.amount_cents / 100).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.description || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {transaction.reference_type && transaction.reference_id 
                        ? `${transaction.reference_type}: ${transaction.reference_id}`
                        : '-'
                      }
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {(!transactions || transactions.length === 0) && (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Nenhuma transação encontrada</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              As transações financeiras aparecerão aqui quando houver movimentações.
            </p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error loading transactions page:', error)
    redirect('/login')
  }
}
