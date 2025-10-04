"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { CreateMaterialSchema, CreateMaterial } from '@/lib/schemas/mm'

interface Vendor {
  vendor_id: string
  vendor_name: string
}

interface CreateMaterialFormProps {
  vendors: Vendor[]
}

export function CreateMaterialForm({ vendors }: CreateMaterialFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<CreateMaterial>({
    resolver: zodResolver(CreateMaterialSchema),
    defaultValues: {
      material_name: '',
      unit_price_cents: 0,
      category: '',
      classification: '',
      vendor_id: ''
    }
  })

  const onSubmit = async (data: CreateMaterial) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/mm/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!result.ok) {
        throw new Error(result.error?.message || 'Erro ao criar material')
      }

      router.push('/mm/materials')
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
            <label htmlFor="material_name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Nome do Material *
            </label>
            <input
              {...register('material_name')}
              type="text"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Ex: Parafuso M6x20"
            />
            {errors.material_name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.material_name.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Categoria *
            </label>
            <input
              {...register('category')}
              type="text"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Ex: Parafusos"
            />
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.category.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="classification" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Classificação *
            </label>
            <input
              {...register('classification')}
              type="text"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="Ex: Aço Inox"
            />
            {errors.classification && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.classification.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="unit_price_cents" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Preço Unitário (R$) *
            </label>
            <input
              {...register('unit_price_cents', { 
                valueAsNumber: true,
                setValueAs: (value) => Math.round(parseFloat(value) * 100)
              })}
              type="number"
              step="0.01"
              min="0"
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
              placeholder="0.00"
            />
            {errors.unit_price_cents && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.unit_price_cents.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="vendor_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Fornecedor
            </label>
            <select
              {...register('vendor_id')}
              className="mt-1 block w-full border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
            >
              <option value="">Selecione um fornecedor</option>
              {vendors.map((vendor) => (
                <option key={vendor.vendor_id} value={vendor.vendor_id}>
                  {vendor.vendor_name}
                </option>
              ))}
            </select>
            {errors.vendor_id && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.vendor_id.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => router.push('/mm/materials')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Material'}
          </button>
        </div>
      </form>
    </div>
  )
}

