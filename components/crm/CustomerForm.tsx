// components/crm/CustomerForm.tsx
"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";

type Props = {
  onSubmit: (formData: FormData) => Promise<any>;
  defaultValues?: Partial<Record<string, any>>;
};

function SubmitBtn({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      className="btn-fiori flex items-center gap-2"
      disabled={pending}
    >
      {pending ? "Salvando..." : label}
    </button>
  );
}

export default function CustomerForm({ onSubmit, defaultValues = {} }: Props) {
  return (
    <form action={onSubmit} className="space-y-6">
      {/* Dados Básicos */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Dados Básicos</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">Nome/Razão Social *</label>
              <input 
                name="name" 
                required 
                defaultValue={defaultValues.name ?? ""} 
                className="input-fiori" 
                placeholder="Nome completo ou razão social"
              />
            </div>
            <div>
              <label className="label-fiori">Tipo de Cliente *</label>
              <select 
                name="customer_type" 
                required 
                defaultValue={defaultValues.customer_type ?? "PF"} 
                className="input-fiori"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">E-mail</label>
              <input 
                name="email" 
                type="email" 
                defaultValue={defaultValues.email ?? ""} 
                className="input-fiori" 
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="label-fiori">Telefone</label>
              <input 
                name="telefone" 
                defaultValue={defaultValues.telefone ?? ""} 
                className="input-fiori" 
                placeholder="(11) 99999-9999" 
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documento */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Documento</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">CPF/CNPJ</label>
              <input 
                name="document_id" 
                defaultValue={defaultValues.document_id ?? ""} 
                className="input-fiori" 
                placeholder="000.000.000-00 ou 00.000.000/0000-00" 
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="label-fiori">Rua</label>
              <input 
                name="addr_street" 
                defaultValue={defaultValues.addr_street ?? ""} 
                className="input-fiori" 
                placeholder="Nome da rua" 
              />
            </div>
            <div>
              <label className="label-fiori">Número</label>
              <input 
                name="addr_number" 
                defaultValue={defaultValues.addr_number ?? ""} 
                className="input-fiori" 
                placeholder="123" 
              />
            </div>
            <div>
              <label className="label-fiori">Complemento</label>
              <input 
                name="addr_complement" 
                defaultValue={defaultValues.addr_complement ?? ""} 
                className="input-fiori" 
                placeholder="Apto 101, Bloco A" 
              />
            </div>
            <div>
              <label className="label-fiori">Bairro</label>
              <input 
                name="addr_district" 
                defaultValue={defaultValues.addr_district ?? ""} 
                className="input-fiori" 
                placeholder="Centro" 
              />
            </div>
            <div>
              <label className="label-fiori">Cidade</label>
              <input 
                name="addr_city" 
                defaultValue={defaultValues.addr_city ?? ""} 
                className="input-fiori" 
                placeholder="São Paulo" 
              />
            </div>
            <div>
              <label className="label-fiori">Estado</label>
              <input 
                name="addr_state" 
                defaultValue={defaultValues.addr_state ?? ""} 
                className="input-fiori" 
                placeholder="SP" 
                maxLength={2}
              />
            </div>
            <div>
              <label className="label-fiori">CEP</label>
              <input 
                name="addr_zip" 
                defaultValue={defaultValues.addr_zip ?? ""} 
                className="input-fiori" 
                placeholder="00000-000" 
              />
            </div>
            <div>
              <label className="label-fiori">País</label>
              <select 
                name="addr_country" 
                defaultValue={defaultValues.addr_country ?? "BR"} 
                className="input-fiori"
              >
                <option value="BR">Brasil</option>
                <option value="US">Estados Unidos</option>
                <option value="AR">Argentina</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Dados CRM */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Dados CRM</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">Categoria do Cliente</label>
              <select 
                name="customer_category" 
                defaultValue={defaultValues.customer_category ?? ""} 
                className="input-fiori"
              >
                <option value="">Selecione...</option>
                <option value="VIP">VIP</option>
                <option value="PESSOA_FISICA">Pessoa Física</option>
                <option value="PESSOA_JURIDICA">Pessoa Jurídica</option>
                <option value="DISTRIBUIDOR">Distribuidor</option>
                <option value="REVENDEDOR">Revendedor</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Classificação do Lead</label>
              <select 
                name="lead_classification" 
                defaultValue={defaultValues.lead_classification ?? ""} 
                className="input-fiori"
              >
                <option value="">Selecione...</option>
                <option value="novo">Novo</option>
                <option value="convertido">Convertido</option>
                <option value="qualificado">Qualificado</option>
                <option value="prospect">Prospect</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Canal de Vendas</label>
              <select 
                name="sales_channel" 
                defaultValue={defaultValues.sales_channel ?? ""} 
                className="input-fiori"
              >
                <option value="">Selecione...</option>
                <option value="site">Site</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="telefone">Telefone</option>
                <option value="email">E-mail</option>
                <option value="indicacao">Indicação</option>
                <option value="redes_sociais">Redes Sociais</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label-fiori">Comentários/Notas</label>
              <textarea 
                name="notes" 
                defaultValue={defaultValues.notes ?? ""} 
                className="input-fiori" 
                rows={3}
                placeholder="Observações sobre o cliente..." 
              />
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
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                name="is_active" 
                defaultChecked={defaultValues.is_active ?? true}
                className="rounded"
              />
              <span className="label-fiori">Cliente Ativo</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <SubmitBtn label="Salvar Cliente" />
        <a href="/crm/customers" className="btn-fiori-outline">
          Cancelar
        </a>
      </div>
    </form>
  );
}
