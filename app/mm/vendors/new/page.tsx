import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@supabase/supabase-js'
import { getTenantId } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function createVendor(formData: FormData) {
  'use server'
  
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const tenantId = await getTenantId()

  const vendorData = {
    tenant_id: tenantId,
    vendor_id: `V${Date.now()}`, // ID simples baseado em timestamp
    vendor_name: formData.get('vendor_name') as string,
    email: formData.get('email') as string,
    telefone: formData.get('telefone') as string,
    cidade: formData.get('city') as string, // Mapear city para cidade
    estado: formData.get('state') as string, // Mapear state para estado
    contact_person: formData.get('contact_person') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    zip_code: formData.get('zip_code') as string,
    country: formData.get('country') as string || 'Brasil',
    tax_id: formData.get('tax_id') as string,
    payment_terms: parseInt(formData.get('payment_terms') as string) || 0, // PIX = 0
    rating: formData.get('rating') as string || 'A', // Excelente = A
    status: 'active'
  }

  try {
    const { data, error } = await supabase
      .from('mm_vendor')
      .insert([vendorData])
      .select('vendor_id')
      .single()

    if (error) {
      console.error('Error creating vendor:', error)
      throw new Error(error.message)
    }

    // Redirecionar com mensagem de sucesso
    redirect(`/mm/vendors?success=Fornecedor ${data.vendor_id} criado com sucesso`)
  } catch (error) {
    console.error('Error creating vendor:', error)
    throw error
  }
}

export default async function NewVendorPage() {
  // Valores fixos para dropdowns (serão movidos para customizing depois)
  const paymentTermsOptions = [
    { value: 0, label: 'PIX' },
    { value: 7, label: '7 dias' },
    { value: 15, label: '15 dias' },
    { value: 30, label: '30 dias' },
    { value: 45, label: '45 dias' },
    { value: 60, label: '60 dias' },
    { value: 90, label: '90 dias' }
  ]

  const ratingOptions = [
    { value: 'A', label: 'A - Excelente' },
    { value: 'B', label: 'B - Bom' },
    { value: 'C', label: 'C - Regular' },
    { value: 'D', label: 'D - Ruim' }
  ]

  const countryOptions = [
    { value: 'Brasil', label: 'Brasil' },
    { value: 'Argentina', label: 'Argentina' },
    { value: 'Chile', label: 'Chile' },
    { value: 'Uruguai', label: 'Uruguai' },
    { value: 'Paraguai', label: 'Paraguai' }
  ]

  const stateOptions = [
    { value: 'AC', label: 'Acre' },
    { value: 'AL', label: 'Alagoas' },
    { value: 'AP', label: 'Amapá' },
    { value: 'AM', label: 'Amazonas' },
    { value: 'BA', label: 'Bahia' },
    { value: 'CE', label: 'Ceará' },
    { value: 'DF', label: 'Distrito Federal' },
    { value: 'ES', label: 'Espírito Santo' },
    { value: 'GO', label: 'Goiás' },
    { value: 'MA', label: 'Maranhão' },
    { value: 'MT', label: 'Mato Grosso' },
    { value: 'MS', label: 'Mato Grosso do Sul' },
    { value: 'MG', label: 'Minas Gerais' },
    { value: 'PA', label: 'Pará' },
    { value: 'PB', label: 'Paraíba' },
    { value: 'PR', label: 'Paraná' },
    { value: 'PE', label: 'Pernambuco' },
    { value: 'PI', label: 'Piauí' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'RN', label: 'Rio Grande do Norte' },
    { value: 'RS', label: 'Rio Grande do Sul' },
    { value: 'RO', label: 'Rondônia' },
    { value: 'RR', label: 'Roraima' },
    { value: 'SC', label: 'Santa Catarina' },
    { value: 'SP', label: 'São Paulo' },
    { value: 'SE', label: 'Sergipe' },
    { value: 'TO', label: 'Tocantins' }
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Novo Fornecedor</h1>
        <p className="text-xl text-fiori-secondary mb-2">Criar novo fornecedor no sistema</p>
        <p className="text-lg text-fiori-muted">Preencha os dados para cadastrar um novo fornecedor</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/vendors" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar para Fornecedores
        </Link>
      </div>
        
      <form action={createVendor} className="space-y-8">
        {/* Dados Básicos */}
        <div className="tile-fiori">
          <h2 className="text-xl font-semibold text-fiori-primary mb-6">Dados Básicos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="vendor_name" className="label-fiori">
                Nome do Fornecedor *
              </label>
              <input
                type="text"
                name="vendor_name"
                id="vendor_name"
                required
                className="input-fiori"
                placeholder="Ex: Joias do Sul Ltda"
              />
            </div>

            <div>
              <label htmlFor="tax_id" className="label-fiori">
                CPF / CNPJ *
              </label>
              <input
                type="text"
                name="tax_id"
                id="tax_id"
                required
                className="input-fiori"
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                maxLength={18}
              />
              <p className="mt-1 text-sm text-gray-500">
                Digite apenas números. A formatação será aplicada automaticamente.
              </p>
            </div>

            <div>
              <label htmlFor="email" className="label-fiori">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                id="email"
                required
                className="input-fiori"
                placeholder="contato@fornecedor.com"
              />
            </div>

            <div>
              <label htmlFor="telefone" className="label-fiori">
                Telefone (11 dígitos)
              </label>
              <input
                type="tel"
                name="telefone"
                id="telefone"
                className="input-fiori"
                placeholder="99999999999"
                maxLength={11}
              />
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="tile-fiori">
          <h2 className="text-xl font-semibold text-fiori-primary mb-6">Contato</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="contact_person" className="label-fiori">
                Nome de Contato
              </label>
              <input
                type="text"
                name="contact_person"
                id="contact_person"
                className="input-fiori"
                placeholder="Ex: João Silva"
              />
            </div>

            <div>
              <label htmlFor="rating" className="label-fiori">
                Avaliação
              </label>
              <select
                name="rating"
                id="rating"
                className="input-fiori"
                defaultValue="A"
              >
                {ratingOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="tile-fiori">
          <h2 className="text-xl font-semibold text-fiori-primary mb-6">Endereço</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label htmlFor="address" className="label-fiori">
                Endereço
              </label>
              <input
                type="text"
                name="address"
                id="address"
                className="input-fiori"
                placeholder="Rua, Avenida, etc."
              />
            </div>

            <div>
              <label htmlFor="city" className="label-fiori">
                Cidade
              </label>
              <input
                type="text"
                name="city"
                id="city"
                className="input-fiori"
                placeholder="Ex: São Paulo"
              />
            </div>

            <div>
              <label htmlFor="state" className="label-fiori">
                Estado
              </label>
              <select
                name="state"
                id="state"
                className="input-fiori"
              >
                <option value="">Selecione o estado</option>
                {stateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="zip_code" className="label-fiori">
                CEP (8 dígitos)
              </label>
              <input
                type="text"
                name="zip_code"
                id="zip_code"
                className="input-fiori"
                placeholder="00000000"
                maxLength={8}
              />
            </div>

            <div>
              <label htmlFor="country" className="label-fiori">
                País
              </label>
              <select
                name="country"
                id="country"
                className="input-fiori"
              >
                {countryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Condições de Pagamento */}
        <div className="tile-fiori">
          <h2 className="text-xl font-semibold text-fiori-primary mb-6">Condições de Pagamento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="payment_terms" className="label-fiori">
                Condição de Pagamento *
              </label>
              <select
                name="payment_terms"
                id="payment_terms"
                required
                className="input-fiori"
                defaultValue="0"
              >
                {paymentTermsOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Botões */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            href="/mm/vendors"
            className="btn-fiori-outline"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn-fiori-primary"
          >
            Salvar Fornecedor
          </button>
        </div>
      </form>
    </div>
  )
}
