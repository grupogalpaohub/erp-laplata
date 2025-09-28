import { createMaterial, getVendors } from '../../_actions'
import MaterialTypeSelect from '@/components/MaterialTypeSelect'
import MaterialClassSelect from '@/components/MaterialClassSelect'

export default async function NewMaterialPage() {
  const vendors = await getVendors()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Novo Material</h1>
        <p className="text-xl text-fiori-secondary mb-2">Cadastre um novo material no sistema</p>
        <p className="text-lg text-fiori-muted">Preencha os campos abaixo para criar o material</p>
      </div>

      {/* Form */}
      <div className="card-fiori">
        <form action={createMaterial} className="space-y-6">
          {/* Informações Básicas */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-fiori-primary">Informações Básicas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_comercial" className="label-fiori">Nome Comercial</label>
                <input
                  type="text"
                  name="mm_comercial"
                  id="mm_comercial"
                  className="input-fiori"
                  placeholder="Nome comercial do produto"
                />
              </div>
              
              <div>
                <label htmlFor="commercial_name" className="label-fiori">Nome Comercial (Alternativo)</label>
                <input
                  type="text"
                  name="commercial_name"
                  id="commercial_name"
                  className="input-fiori"
                  placeholder="Nome alternativo do produto"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="mm_desc" className="label-fiori">Descrição *</label>
                <textarea
                  name="mm_desc"
                  id="mm_desc"
                  required
                  rows={3}
                  className="input-fiori"
                  placeholder="Descrição detalhada do material"
                />
              </div>
              
              <div>
                <label htmlFor="mm_mat_type" className="label-fiori">Tipo de Material</label>
                <MaterialTypeSelect
                  name="mm_mat_type"
                  className="input-fiori"
                />
              </div>
              
              <div>
                <label htmlFor="mm_mat_class" className="label-fiori">Classe do Material</label>
                <MaterialClassSelect
                  name="mm_mat_class"
                  className="input-fiori"
                />
              </div>
            </div>
          </div>

          {/* Preços */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-fiori-primary">Preços</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_price" className="label-fiori">Preço de Venda (R$)</label>
                <input
                  type="number"
                  name="mm_price"
                  id="mm_price"
                  step="0.01"
                  min="0"
                  className="input-fiori"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <label htmlFor="mm_purchase_price" className="label-fiori">Preço de Compra (R$)</label>
                <input
                  type="number"
                  name="mm_purchase_price"
                  id="mm_purchase_price"
                  step="0.01"
                  min="0"
                  className="input-fiori"
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          {/* Fornecedor e Estoque */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-fiori-primary">Fornecedor e Estoque</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_vendor_id" className="label-fiori">Fornecedor</label>
                <select
                  name="mm_vendor_id"
                  id="mm_vendor_id"
                  className="input-fiori"
                >
                  <option value="">Selecione um fornecedor</option>
                  {vendors.map((vendor) => (
                    <option key={vendor.vendor_id} value={vendor.vendor_id}>
                      {vendor.vendor_name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="lead_time_days" className="label-fiori">Lead Time (dias)</label>
                <input
                  type="number"
                  name="lead_time_days"
                  id="lead_time_days"
                  min="0"
                  className="input-fiori"
                  placeholder="7"
                  defaultValue="7"
                />
              </div>
              
              <div>
                <label htmlFor="min_stock" className="label-fiori">Estoque Mínimo</label>
                <input
                  type="number"
                  name="min_stock"
                  id="min_stock"
                  min="0"
                  className="input-fiori"
                  placeholder="0"
                  defaultValue="0"
                />
              </div>
              
              <div>
                <label htmlFor="max_stock" className="label-fiori">Estoque Máximo</label>
                <input
                  type="number"
                  name="max_stock"
                  id="max_stock"
                  min="0"
                  className="input-fiori"
                  placeholder="1000"
                  defaultValue="1000"
                />
              </div>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-fiori-primary">Informações Adicionais</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="mm_pur_link" className="label-fiori">Link de Compra</label>
                <input
                  type="url"
                  name="mm_pur_link"
                  id="mm_pur_link"
                  className="input-fiori"
                  placeholder="https://exemplo.com/produto"
                />
              </div>
              
              <div>
                <label htmlFor="unit_of_measure" className="label-fiori">Unidade de Medida</label>
                <select
                  name="unit_of_measure"
                  id="unit_of_measure"
                  className="input-fiori"
                  defaultValue="unidade"
                >
                  <option value="unidade">Unidade</option>
                  <option value="kg">Quilograma</option>
                  <option value="g">Grama</option>
                  <option value="m">Metro</option>
                  <option value="cm">Centímetro</option>
                  <option value="litro">Litro</option>
                  <option value="ml">Mililitro</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
            <a
              href="/mm/materials"
              className="btn-fiori-outline"
            >
              Cancelar
            </a>
            <button
              type="submit"
              className="btn-fiori-primary"
            >
              Criar Material
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}