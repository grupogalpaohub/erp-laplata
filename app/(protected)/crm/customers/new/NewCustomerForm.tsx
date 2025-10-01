'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Save, X } from 'lucide-react'
import { createCustomerAction } from '@/app/(protected)/crm/customers/new/actions'

export default function NewCustomerForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/crm/customers'
  
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    contact_phone: '',
    document_id: '',
    customer_type: 'PF',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    country: 'Brasil'
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with data:', formData)
    setIsLoading(true)
    setError('')

    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      console.log('Calling createCustomerAction...')
      console.log('FormData entries:', Array.from(formDataObj.entries()))
      
      const result = await createCustomerAction({ ok: false, error: '' }, formDataObj)
      console.log('createCustomerAction result:', result)

      if (result.ok) {
        // Mostrar popup de sucesso
        const shouldCreateOrder = confirm(
          `Cliente criado com sucesso!\n\n` +
          'Deseja criar um pedido de venda para este cliente?'
        )
        
        if (shouldCreateOrder) {
          // Redirecionar para novo pedido com cliente selecionado
          router.push(`/sd/orders/new?customerId=${result.id || ''}`)
        } else {
          // Redirecionar para lista de clientes
          router.push('/crm/customers')
        }
      } else {
        setError(result.error || 'Erro ao criar cliente')
      }
    } catch (error) {
      console.error('Error creating customer:', error)
      setError('Erro ao criar cliente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="card-fiori">
      <div className="card-fiori-header">
        <h2 className="card-fiori-title">Dados do Cliente</h2>
      </div>
      <div className="card-fiori-content">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="label-fiori">
                Nome/Razão Social *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="Nome completo ou razão social"
              />
            </div>

            <div>
              <label htmlFor="customer_type" className="label-fiori">
                Tipo de Cliente *
              </label>
              <select
                id="customer_type"
                name="customer_type"
                required
                value={formData.customer_type}
                onChange={handleInputChange}
                className="select-fiori"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>

            <div>
              <label htmlFor="document_id" className="label-fiori">
                CPF / CNPJ *
              </label>
              <input
                type="text"
                id="document_id"
                name="document_id"
                required
                value={formData.document_id}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
              />
            </div>

            <div>
              <label htmlFor="contact_email" className="label-fiori">
                E-mail *
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                required
                value={formData.contact_email}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="email@exemplo.com"
              />
            </div>

            <div>
              <label htmlFor="contact_phone" className="label-fiori">
                Telefone
              </label>
              <input
                type="tel"
                id="contact_phone"
                name="contact_phone"
                value={formData.contact_phone}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="(11) 99999-9999"
              />
            </div>

            <div>
              <label htmlFor="address" className="label-fiori">
                Endereço
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="Rua, número, complemento"
              />
            </div>

            <div>
              <label htmlFor="city" className="label-fiori">
                Cidade
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="São Paulo"
              />
            </div>

            <div>
              <label htmlFor="state" className="label-fiori">
                Estado
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="SP"
              />
            </div>

            <div>
              <label htmlFor="zip_code" className="label-fiori">
                CEP
              </label>
              <input
                type="text"
                id="zip_code"
                name="zip_code"
                value={formData.zip_code}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="00000-000"
              />
            </div>

            <div>
              <label htmlFor="country" className="label-fiori">
                País
              </label>
              <input
                type="text"
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="input-fiori"
                placeholder="Brasil"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-fiori flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isLoading ? 'Salvando...' : 'Salvar Cliente'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/crm/customers')}
              className="btn-fiori-outline flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

