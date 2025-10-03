import { redirect } from 'next/navigation'
import { CreateCustomerForm } from './CreateCustomerForm'

export default async function NewCustomerPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center space-x-4">
        <a
          href="/sd/customers"
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Novo Cliente
        </h1>
      </div>

      <CreateCustomerForm />
    </div>
  )
}
