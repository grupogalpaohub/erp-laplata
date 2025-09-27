import Link from 'next/link'
import { redirect } from 'next/navigation'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import MaterialClassSelect from '@/components/MaterialClassSelect'
import { getVendors, getCustomizingData, createMaterial } from '@/app/(protected)/mm/_actions'

type Vendor = {
  vendor_id: string
  vendor_name: string
}

type CustomizingData = {
  types: string[]
  classifications: string[]
}

export default async function NewMaterialPage() {
  // Carregar dados iniciais via SSR
  const [vendors, customizingData] = await Promise.all([
    getVendors(),
    getCustomizingData()
  ])

  async function handleSubmit(formData: FormData) {
    'use server'
    
    try {
      const result = await createMaterial(formData)
      redirect(`/mm/catalog?success=Material ${result.mm_material} criado com sucesso`)
    } catch (error) {
      console.error('Erro ao criar material:', error)
      redirect(`/mm/materials/new?error=${encodeURIComponent(error instanceof Error ? error.message : 'Erro interno do servidor')}`)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Novo Material</h1>
        <p className="text-xl text-fiori-secondary mb-2">Criar novo material no sistema</p>
        <p className="text-lg text-fiori-muted">Preencha os dados para cadastrar um novo material</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/catalog" className="btn-fiori-outline">
          Voltar para Catálogo
        </Link>
      </div>
        
      <form action={handleSubmit} className="space-y-6">
        <div className="form-fiori">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label htmlFor="mm_mat_type" className="label-fiori">
                Tipo de Material *
              </label>
              <MaterialTypeSelect
                name="mm_mat_type"
                id="mm_mat_type"
                className="input-fiori"
                options={customizingData.types}
              />
              <p className="mt-1 text-sm text-gray-500">
                O ID do material será gerado automaticamente baseado no tipo selecionado
              </p>
            </div>

            <div>
              <label htmlFor="mm_comercial" className="label-fiori">
                Nome Comercial
              </label>
              <input
                type="text"
                name="mm_comercial"
                id="mm_comercial"
                className="input-fiori"
                placeholder="Ex: Brinco de Prata"
              />
            </div>

            <div>
              <label htmlFor="mm_desc" className="label-fiori">
                Descrição *
              </label>
              <textarea
                name="mm_desc"
                id="mm_desc"
                rows={3}
                required
                className="input-fiori"
                placeholder="Descrição detalhada do material"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_mat_class" className="label-fiori">
                  Classificação *
                </label>
                <MaterialClassSelect
                  name="mm_mat_class"
                  id="mm_mat_class"
                  className="input-fiori"
                  options={customizingData.classifications}
                />
              </div>
            </div>

            <div>
              <label htmlFor="mm_vendor_id" className="label-fiori">
                Fornecedor *
              </label>
              <select
                name="mm_vendor_id"
                id="mm_vendor_id"
                required
                className="input-fiori"
              >
                <option value="">Selecione o fornecedor...</option>
                {vendors.map((vendor) => (
                  <option key={vendor.vendor_id} value={vendor.vendor_id}>
                    {vendor.vendor_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_price" className="label-fiori">
                  Preço de Venda (R$) *
                </label>
                <input
                  type="number"
                  name="mm_price"
                  id="mm_price"
                  step="0.01"
                  min="0"
                  required
                  className="input-fiori"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="mm_purchase_price" className="label-fiori">
                  Preço de Compra (R$) *
                </label>
                <input
                  type="number"
                  name="mm_purchase_price"
                  id="mm_purchase_price"
                  step="0.01"
                  min="0"
                  required
                  className="input-fiori"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label htmlFor="mm_pur_link" className="label-fiori">
                Link de Compra
              </label>
              <input
                type="url"
                name="mm_pur_link"
                id="mm_pur_link"
                className="input-fiori"
                placeholder="https://exemplo.com/produto"
              />
            </div>

            <div>
              <label htmlFor="lead_time_days" className="label-fiori">
                Lead Time (dias) *
              </label>
              <input
                type="number"
                name="lead_time_days"
                id="lead_time_days"
                min="0"
                required
                className="input-fiori"
                placeholder="7"
              />
            </div>

          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            href="/mm/catalog"
            className="btn-fiori-outline"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="btn-fiori-primary"
          >
            Salvar Material
          </button>
        </div>
      </form>
    </div>
  )
}
