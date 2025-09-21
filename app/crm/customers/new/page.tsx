import Link from 'next/link'
import { createSupabaseServerClient } from '@/lib/supabaseServer'
import { getTenantId } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { ArrowLeft, Save, X } from 'lucide-react'

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

async function createCustomer(formData: FormData) {
  'use server'
  
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    // Gerar ID único para o cliente
    const customerId = `CUST-${Date.now()}`

    // Extrair dados do formulário
    const customerData = {
      tenant_id: tenantId,
      customer_id: customerId,
      name: String(formData.get('name') || ''),
      contact_email: String(formData.get('contact_email') || ''),
      contact_phone: String(formData.get('contact_phone') || ''),
      phone_country: String(formData.get('phone_country') || 'BR'),
      document_id: String(formData.get('document_id') || ''),
      addr_street: String(formData.get('addr_street') || ''),
      addr_number: String(formData.get('addr_number') || ''),
      addr_complement: String(formData.get('addr_complement') || ''),
      addr_district: String(formData.get('addr_district') || ''),
      addr_city: String(formData.get('addr_city') || ''),
      addr_state: String(formData.get('addr_state') || ''),
      addr_zip: String(formData.get('addr_zip') || ''),
      addr_country: String(formData.get('addr_country') || 'BR'),
      payment_terms: String(formData.get('payment_terms') || ''),
      is_active: formData.get('is_active') === 'on',
      customer_type: String(formData.get('customer_type') || 'PF'),
      created_date: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString()
    }

    // Validações
    if (!customerData.name) {
      throw new Error('Nome é obrigatório')
    }
    if (!customerData.contact_email) {
      throw new Error('Email é obrigatório')
    }
    if (!customerData.payment_terms) {
      throw new Error('Forma de pagamento é obrigatória')
    }

    // Verificar se email já existe
    const { data: existingCustomer } = await supabase
      .from('crm_customer')
      .select('customer_id')
      .eq('tenant_id', tenantId)
      .eq('contact_email', customerData.contact_email)
      .single()

    if (existingCustomer) {
      throw new Error('Email já cadastrado para outro cliente')
    }

    // Inserir cliente
    const { error } = await supabase
      .from('crm_customer')
      .insert(customerData)

    if (error) {
      console.error('Error creating customer:', error)
      throw new Error('Erro ao criar cliente: ' + error.message)
    }

    // Registrar auditoria
    await supabase
      .from('audit_log')
      .insert({
        tenant_id: tenantId,
        table_name: 'crm_customer',
        record_pk: customerId,
        action: 'INSERT',
        diff_json: { created: customerData },
        actor_user: null, // TODO: pegar do contexto de auth
        created_at: new Date().toISOString()
      })

    // Redirecionar após sucesso
    redirect(`/crm/customers/${customerId}`)

  } catch (error) {
    console.error('Error creating customer:', error)
    // Em caso de erro, redirecionar de volta para a página de criação
    redirect(`/crm/customers/new?error=${encodeURIComponent(error instanceof Error ? error.message : 'Erro desconhecido')}`)
  }
}

export default async function NewCustomerPage() {
  // Buscar opções de payment terms
  let paymentTerms: any[] = []
  try {
    const supabase = createSupabaseServerClient()
    const tenantId = await getTenantId()

    const { data } = await supabase
      .from('fi_payment_terms_def')
      .select('terms_code, description')
      .eq('tenant_id', tenantId)
      .eq('is_active', true)
      .order('description')

    paymentTerms = data || []
    
    // Se não houver dados, usar dados padrão
    if (paymentTerms.length === 0) {
      paymentTerms = [
        { terms_code: 'A_VISTA', description: 'À Vista' },
        { terms_code: '30_DIAS', description: '30 Dias' },
        { terms_code: '60_DIAS', description: '60 Dias' },
        { terms_code: '90_DIAS', description: '90 Dias' },
        { terms_code: 'BOLETO', description: 'Boleto Bancário' },
        { terms_code: 'CARTAO_CREDITO', description: 'Cartão de Crédito' },
        { terms_code: 'CARTAO_DEBITO', description: 'Cartão de Débito' },
        { terms_code: 'PIX', description: 'PIX' },
        { terms_code: 'TRANSFERENCIA', description: 'Transferência Bancária' },
        { terms_code: 'DINHEIRO', description: 'Dinheiro' }
      ]
    }
  } catch (error) {
    console.error('Error loading payment terms:', error)
    // Usar dados padrão em caso de erro
    paymentTerms = [
      { terms_code: 'A_VISTA', description: 'À Vista' },
      { terms_code: '30_DIAS', description: '30 Dias' },
      { terms_code: '60_DIAS', description: '60 Dias' },
      { terms_code: '90_DIAS', description: '90 Dias' },
      { terms_code: 'BOLETO', description: 'Boleto Bancário' },
      { terms_code: 'CARTAO_CREDITO', description: 'Cartão de Crédito' },
      { terms_code: 'CARTAO_DEBITO', description: 'Cartão de Débito' },
      { terms_code: 'PIX', description: 'PIX' },
      { terms_code: 'TRANSFERENCIA', description: 'Transferência Bancária' },
      { terms_code: 'DINHEIRO', description: 'Dinheiro' }
    ]
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/crm/customers" className="btn-fiori-outline flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-fiori-primary">Novo Cliente</h1>
            <p className="text-fiori-secondary mt-2">Cadastrar novo cliente no sistema</p>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <form action={createCustomer} className="space-y-8">
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
                  className="input-fiori"
                  placeholder="Nome completo do cliente"
                />
              </div>
              <div>
                <label htmlFor="customer_type" className="label-fiori">
                  Tipo de Cliente
                </label>
                <select id="customer_type" name="customer_type" className="select-fiori">
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
                  className="input-fiori"
                  placeholder="Nome da pessoa de contato"
                />
              </div>
              <div>
                <label htmlFor="phone_country" className="label-fiori">
                  País
                </label>
                <select id="phone_country" name="phone_country" className="select-fiori">
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
                  className="input-fiori"
                  placeholder="00000-000"
                />
              </div>
              <div>
                <label htmlFor="addr_country" className="label-fiori">
                  País
                </label>
                <select id="addr_country" name="addr_country" className="select-fiori">
                  <option value="BR">Brasil</option>
                  <option value="US">Estados Unidos</option>
                  <option value="AR">Argentina</option>
                  <option value="UY">Uruguai</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Pagamento e Status */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <h3 className="card-fiori-title">Pagamento e Status</h3>
          </div>
          <div className="card-fiori-content">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="payment_terms" className="label-fiori">
                  Forma de Pagamento *
                </label>
                <select id="payment_terms" name="payment_terms" required className="select-fiori">
                  <option value="">Selecione uma forma de pagamento</option>
                  {paymentTerms.map((term) => (
                    <option key={term.terms_code} value={term.terms_code}>
                      {term.description}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  defaultChecked
                  className="checkbox-fiori"
                />
                <label htmlFor="is_active" className="label-fiori ml-2">
                  Cliente ativo
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Link href="/crm/customers" className="btn-fiori-outline flex items-center gap-2">
            <X className="w-4 h-4" />
            Cancelar
          </Link>
          <button type="submit" className="btn-fiori-primary flex items-center gap-2">
            <Save className="w-4 h-4" />
            Salvar Cliente
          </button>
        </div>
      </form>
    </div>
  )
}
