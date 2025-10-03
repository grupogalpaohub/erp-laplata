"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateCustomerSchema, CreateCustomer } from '@/lib/schemas/sd'

export function CreateCustomerForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateCustomer>({
    resolver: zodResolver(CreateCustomerSchema),
    defaultValues: {
      customer_name: '',
      email: '',
      phone: '',
      customer_type: 'PF',
      preferred_payment_method: ''
    }
  })

  const onSubmit = async (data: CreateCustomer) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/sd/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'Erro ao criar cliente')
      }

      router.push('/sd/customers')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  Erro
                </h3>
                <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="customer_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Cliente *
            </label>
            <input
              {...register('customer_name')}
              type="text"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Ex: João Silva"
            />
            {errors.customer_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.customer_name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="customer_type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tipo de Cliente
            </label>
            <select
              {...register('customer_type')}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="PF">Pessoa Física</option>
              <option value="PJ">Pessoa Jurídica</option>
            </select>
            {errors.customer_type && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.customer_type.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              {...register('email')}
              type="email"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="joao@exemplo.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Telefone
            </label>
            <input
              {...register('phone')}
              type="text"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="(11) 99999-9999"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="preferred_payment_method" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Método de Pagamento Preferido
            </label>
            <select
              {...register('preferred_payment_method')}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">Selecione um método</option>
              <option value="dinheiro">Dinheiro</option>
              <option value="cartao_credito">Cartão de Crédito</option>
              <option value="cartao_debito">Cartão de Débito</option>
              <option value="pix">PIX</option>
              <option value="transferencia">Transferência Bancária</option>
              <option value="boleto">Boleto</option>
            </select>
            {errors.preferred_payment_method && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.preferred_payment_method.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/sd/customers')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Cliente'}
          </button>
        </div>
      </form>
    </div>
  )
}
