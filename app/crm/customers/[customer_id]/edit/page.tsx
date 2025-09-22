import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/src/lib/auth'
import { ArrowLeft, Save, X } from 'lucide-react'
import { notFound, redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

interface Customer {
  customer_id: string
  name: string
  contact_email: string
  contact_phone: string
  phone_country: string
  document_id: string
  contact_name: string
  addr_street: string
  addr_number: string
  addr_complement: string
  addr_district: string
  addr_city: string
  addr_state: string
  addr_zip: string
  addr_country: string
  payment_terms: string
  is_active: boolean
  customer_type: string
  created_date: string
  updated_at: string
  // Campos CRM
  customer_category: string
  lead_classification: string
  sales_channel: string
  notes: string
  preferred_payment_method: string
  preferred_payment_terms: string
}

interface PageProps {
  params: {
    customer_id: string
  }
}

async function updateCustomer(formData: FormData) {
  'use server'
  
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()
    const customerId = String(formData.get('customer_id') || '')

    // Buscar dados atuais para comparação
    const { data: currentData } = await supabase
      .from('crm_customer')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)
      .single()

    if (!currentData) {
      throw new Error('Cliente não encontrado')
    }

    // Extrair dados do formulário
    const updatedData = {
      name: String(formData.get('name') || ''),
      contact_email: String(formData.get('contact_email') || ''),
      contact_phone: String(formData.get('contact_phone') || ''),
      phone_country: String(formData.get('phone_country') || 'BR'),
      document_id: String(formData.get('document_id') || ''),
      contact_name: String(formData.get('contact_name') || ''),
      addr_street: String(formData.get('addr_street') || ''),
      addr_number: String(formData.get('addr_number') || ''),
      addr_complement: String(formData.get('addr_complement') || ''),
      addr_district: String(formData.get('addr_district') || ''),
      addr_city: String(formData.get('addr_city') || ''),
      addr_state: String(formData.get('addr_state') || ''),
      addr_zip: String(formData.get('addr_zip') || ''),
      addr_country: String(formData.get('addr_country') || 'BR'),
      is_active: formData.get('is_active') === 'on',
      customer_type: String(formData.get('customer_type') || 'PF'),
      // Campos CRM
      customer_category: String(formData.get('customer_category') || ''),
      lead_classification: String(formData.get('lead_classification') || ''),
      sales_channel: String(formData.get('sales_channel') || ''),
      notes: String(formData.get('notes') || ''),
      updated_at: new Date().toISOString()
    }

    // Validações
    if (!updatedData.name) {
      throw new Error('Nome é obrigatório')
    }
    if (!updatedData.contact_email) {
      throw new Error('Email é obrigatório')
    }

    // Verificar se email já existe para outro cliente
    const { data: existingCustomer } = await supabase
      .from('crm_customer')
      .select('customer_id')
      .eq('tenant_id', tenantId)
      .eq('contact_email', updatedData.contact_email)
      .neq('customer_id', customerId)
      .single()

    if (existingCustomer) {
      throw new Error('Email já cadastrado para outro cliente')
    }

    // Calcular diferenças para auditoria
    const changes: Record<string, { before: any; after: any }> = {}
    Object.keys(updatedData).forEach(key => {
      if (key !== 'updated_at' && (currentData as any)[key] !== (updatedData as any)[key]) {
        changes[key] = {
          before: (currentData as any)[key],
          after: (updatedData as any)[key]
        }
      }
    })

    // Atualizar cliente
    const { error } = await supabase
      .from('crm_customer')
      .update(updatedData)
      .eq('tenant_id', tenantId)
      .eq('customer_id', customerId)

    if (error) {
      console.error('Error updating customer:', error)
      throw new Error('Erro ao atualizar cliente: ' + error.message)
    }

    // Registrar auditoria se houver mudanças
    if (Object.keys(changes).length > 0) {
      await supabase
        .from('audit_log')
        .insert({
          tenant_id: tenantId,
          table_name: 'crm_customer',
          record_pk: customerId,
          action: 'UPDATE',
          diff_json: changes,
          actor_user: null, // TODO: pegar do contexto de auth
          created_at: new Date().toISOString()
        })
    }

    // Redirecionar após sucesso
    redirect(`/crm/customers/${customerId}`)

  } catch (error) {
    console.error('Error updating customer:', error)
    // Em caso de erro, redirecionar de volta para a página de edição
    redirect(`/crm/customers/${formData.get('customer_id')}/edit?error=${encodeURIComponent(error instanceof Error ? error.message : 'Erro desconhecido')}`)
  }
}

export default async function EditCustomerPage({ params }: PageProps) {
  let customer: Customer | null = null

  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Buscar dados do cliente
    const { data: customerData, error: customerError } = await supabase
      .from('crm_customer')
      .select('*')
      .eq('tenant_id', tenantId)
      .eq('customer_id', params.customer_id)
      .single()

    if (customerError || !customerData) {
      notFound()
    }

    customer = customerData


  } catch (error) {
    console.error('Error loading customer data:', error)
    notFound()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/crm/customers/${customer?.customer_id}`} className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Editar Cliente</h1>
            <p className="text-fiori-secondary mt-2">{customer?.name}</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form action={updateCustomer} className="space-y-8">
        <input type="hidden" name="customer_id" value={customer?.customer_id} />

        {/* Dados Básicos */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Dados Básicos</h3>
          </div>
          <div className="card-fiori-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="label-fiori">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={customer?.name}
                  className="input-fiori"
                  placeholder="Nome completo do cliente"
                />
              </div>
              <div>
                <label htmlFor="customer_type" className="label-fiori">
                  Tipo de Cliente
                </label>
                <select id="customer_type" name="customer_type" defaultValue={customer?.customer_type} className="select-fiori">
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
              </div>
              <div>
                <label htmlFor="document_id" className="label-fiori">
                  CPF/CNPJ
                </label>
                <input
                  type="text"
                  id="document_id"
                  name="document_id"
                  defaultValue={customer?.document_id || ''}
                  className="input-fiori"
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                />
              </div>
              <div>
                <label htmlFor="contact_email" className="label-fiori">
                  Email *
                </label>
                <input
                  type="email"
                  id="contact_email"
                  name="contact_email"
                  required
                  defaultValue={customer?.contact_email || ''}
                  className="input-fiori"
                  placeholder="cliente@exemplo.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Contato */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Contato</h3>
          </div>
          <div className="card-fiori-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="contact_name" className="label-fiori">
                  Nome do Contato
                </label>
                <input
                  type="text"
                  id="contact_name"
                  name="contact_name"
                  defaultValue={customer?.contact_name || ''}
                  className="input-fiori"
                  placeholder="Nome da pessoa de contato"
                />
              </div>
              <div>
                <label htmlFor="phone_country" className="label-fiori">
                  País
                </label>
                <select id="phone_country" name="phone_country" defaultValue={customer?.phone_country || 'BR'} className="select-fiori">
                  <option value="BR">Brasil (+55)</option>
                  <option value="US">Estados Unidos (+1)</option>
                  <option value="AR">Argentina (+54)</option>
                  <option value="UY">Uruguai (+598)</option>
                </select>
              </div>
              <div>
                <label htmlFor="contact_phone" className="label-fiori">
                  Telefone
                </label>
                <input
                  type="tel"
                  id="contact_phone"
                  name="contact_phone"
                  defaultValue={customer?.contact_phone || ''}
                  className="input-fiori"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Endereço</h3>
          </div>
          <div className="card-fiori-content">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label htmlFor="addr_street" className="label-fiori">
                  Rua/Avenida
                </label>
                <input
                  type="text"
                  id="addr_street"
                  name="addr_street"
                  defaultValue={customer?.addr_street || ''}
                  className="input-fiori"
                  placeholder="Nome da rua ou avenida"
                />
              </div>
              <div>
                <label htmlFor="addr_number" className="label-fiori">
                  Número
                </label>
                <input
                  type="text"
                  id="addr_number"
                  name="addr_number"
                  defaultValue={customer?.addr_number || ''}
                  className="input-fiori"
                  placeholder="123"
                />
              </div>
              <div>
                <label htmlFor="addr_complement" className="label-fiori">
                  Complemento
                </label>
                <input
                  type="text"
                  id="addr_complement"
                  name="addr_complement"
                  defaultValue={customer?.addr_complement || ''}
                  className="input-fiori"
                  placeholder="Apto 45, Bloco B"
                />
              </div>
              <div>
                <label htmlFor="addr_district" className="label-fiori">
                  Bairro
                </label>
                <input
                  type="text"
                  id="addr_district"
                  name="addr_district"
                  defaultValue={customer?.addr_district || ''}
                  className="input-fiori"
                  placeholder="Centro"
                />
              </div>
              <div>
                <label htmlFor="addr_city" className="label-fiori">
                  Cidade
                </label>
                <input
                  type="text"
                  id="addr_city"
                  name="addr_city"
                  defaultValue={customer?.addr_city || ''}
                  className="input-fiori"
                  placeholder="São Paulo"
                />
              </div>
              <div>
                <label htmlFor="addr_state" className="label-fiori">
                  Estado
                </label>
                <input
                  type="text"
                  id="addr_state"
                  name="addr_state"
                  defaultValue={customer?.addr_state || ''}
                  className="input-fiori"
                  placeholder="SP"
                  maxLength={2}
                />
              </div>
              <div>
                <label htmlFor="addr_zip" className="label-fiori">
                  CEP
                </label>
                <input
                  type="text"
                  id="addr_zip"
                  name="addr_zip"
                  defaultValue={customer?.addr_zip || ''}
                  className="input-fiori"
                  placeholder="00000-000"
                />
              </div>
              <div>
                <label htmlFor="addr_country" className="label-fiori">
                  País
                </label>
                <select id="addr_country" name="addr_country" defaultValue={customer?.addr_country || 'BR'} className="select-fiori">
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                  <option value="AR">Argentina</option>
                  <option value="UY">Uruguai</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Informações CRM */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Informações CRM</h3>
          </div>
          <div className="card-fiori-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="customer_category" className="label-fiori">
                  Categoria do Cliente
                </label>
                <select id="customer_category" name="customer_category" defaultValue={customer?.customer_category || ''} className="select-fiori">
                  <option value="">Selecione...</option>
                  <option value="VIP">VIP</option>
                  <option value="REGULAR">Regular</option>
                  <option value="CORPORATIVO">Corporativo</option>
                  <option value="PESSOA_FISICA">Pessoa Física</option>
                  <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                  <option value="DISTRIBUIDOR">Distribuidor</option>
                  <option value="REVENDEDOR">Revendedor</option>
                </select>
              </div>
              <div>
                <label htmlFor="lead_classification" className="label-fiori">
                  Classificação do Lead
                </label>
                <select id="lead_classification" name="lead_classification" defaultValue={customer?.lead_classification || ''} className="select-fiori">
                  <option value="">Selecione...</option>
                  <option value="novo">Novo</option>
                  <option value="em_contato">Em Contato</option>
                  <option value="qualificado">Qualificado</option>
                  <option value="convertido">Convertido</option>
                  <option value="perdido">Perdido</option>
                </select>
              </div>
              <div>
                <label htmlFor="sales_channel" className="label-fiori">
                  Canal de Vendas
                </label>
                <select id="sales_channel" name="sales_channel" defaultValue={customer?.sales_channel || ''} className="select-fiori">
                  <option value="">Selecione...</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="site">Site</option>
                  <option value="indicacao">Indicação</option>
                  <option value="familia_amigos">Família/Amigos</option>
                </select>
              </div>
              <div>
                <label htmlFor="notes" className="label-fiori">
                  Observações
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  defaultValue={customer?.notes || ''}
                  className="input-fiori"
                  placeholder="Observações sobre o cliente..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Pagamento Favorito - Somente Leitura */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Pagamento Favorito</h3>
            <p className="text-sm text-fiori-secondary">Preenchido automaticamente baseado no histórico de pagamentos</p>
          </div>
          <div className="card-fiori-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label-fiori text-fiori-secondary">
                  Método de Pagamento Favorito
                </label>
                <div className="input-fiori bg-gray-50 text-gray-500">
                  {customer?.preferred_payment_method || 'Será definido automaticamente'}
                </div>
              </div>
              <div>
                <label className="label-fiori text-fiori-secondary">
                  Prazo de Pagamento Favorito
                </label>
                <div className="input-fiori bg-gray-50 text-gray-500">
                  {customer?.preferred_payment_terms || 'Será definido automaticamente'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Status</h3>
          </div>
          <div className="card-fiori-content">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                name="is_active"
                defaultChecked={customer?.is_active}
                className="checkbox-fiori"
              />
              <label htmlFor="is_active" className="label-fiori ml-2">
                Cliente ativo
              </label>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Link href={`/crm/customers/${customer?.customer_id}`} className="btn-fiori-outline flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button type="submit" className="btn-fiori-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Alterações
          </button>
        </div>
      </form>
    </div>
  )
}
