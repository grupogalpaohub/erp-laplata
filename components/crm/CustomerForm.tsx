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
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Dados do Cliente</h3>
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
                className="select-fiori"
              >
                <option value="PF">Pessoa Física</option>
                <option value="PJ">Pessoa Jurídica</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">CPF / CNPJ</label>
              <input 
                name="document_id" 
                defaultValue={defaultValues.document_id ?? ""} 
                className="input-fiori" 
                placeholder="000.000.000-00 ou 00.000.000/0000-00" 
              />
            </div>
            <div>
              <label className="label-fiori">E-mail</label>
              <input 
                name="contact_email" 
                type="email" 
                defaultValue={defaultValues.contact_email ?? ""} 
                className="input-fiori" 
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="label-fiori">Telefone</label>
              <input 
                name="contact_phone" 
                defaultValue={defaultValues.contact_phone ?? ""} 
                className="input-fiori" 
                placeholder="(11) 99999-9999" 
              />
            </div>
            <div>
              <label className="label-fiori">Endereço</label>
              <input 
                name="address" 
                defaultValue={defaultValues.address ?? ""} 
                className="input-fiori" 
                placeholder="Rua, número, complemento" 
              />
            </div>
            <div>
              <label className="label-fiori">Cidade</label>
              <input 
                name="city" 
                defaultValue={defaultValues.city ?? ""} 
                className="input-fiori" 
                placeholder="São Paulo"
              />
            </div>
            <div>
              <label className="label-fiori">Estado</label>
              <input 
                name="state" 
                defaultValue={defaultValues.state ?? ""} 
                className="input-fiori" 
                placeholder="SP" 
              />
            </div>
            <div>
              <label className="label-fiori">CEP</label>
              <input 
                name="zip_code" 
                defaultValue={defaultValues.zip_code ?? ""} 
                className="input-fiori" 
                placeholder="00000-000" 
              />
            </div>
            <div>
              <label className="label-fiori">País</label>
              <input 
                name="country" 
                defaultValue={defaultValues.country ?? "Brasil"} 
                className="input-fiori" 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Preferências e Classificação</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label-fiori">Canal/Origem *</label>
              <select 
                name="sales_channel" 
                required
                defaultValue={defaultValues.sales_channel ?? ""} 
                className="select-fiori"
              >
                <option value="">Selecione...</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="instagram">Instagram</option>
                <option value="site">Site</option>
                <option value="feira">Feira</option>
                <option value="indicacao">Indicação</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Categoria/Classe</label>
              <select 
                name="customer_category" 
                defaultValue={defaultValues.customer_category ?? ""} 
                className="select-fiori"
              >
                <option value="">Selecione...</option>
                <option value="ATACADO">Atacado</option>
                <option value="VAREJO">Varejo</option>
                <option value="VIP">VIP</option>
                <option value="REGULAR">Regular</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="label-fiori">Observações / Notas Internas</label>
              <textarea 
                name="notes" 
                rows={4} 
                defaultValue={defaultValues.notes ?? ""} 
                className="input-fiori" 
                placeholder="Observações adicionais sobre o cliente..."
              />
            </div>
            <div>
              <label className="inline-flex items-center gap-2">
                <input 
                  type="checkbox" 
                  name="is_active" 
                  defaultChecked={defaultValues.is_active ?? true} 
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-fiori-secondary">Cliente ativo</span>
              </label>
            </div>
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
