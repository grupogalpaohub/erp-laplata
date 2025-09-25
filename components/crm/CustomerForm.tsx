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
              <label className="label-fiori">CPF / CNPJ *</label>
              <input 
                name="tax_id" 
                required 
                defaultValue={defaultValues.tax_id ?? ""} 
                className="input-fiori" 
                placeholder="000.000.000-00 ou 00.000.000/0000-00" 
              />
            </div>
            <div>
              <label className="label-fiori">E-mail *</label>
              <input 
                name="email" 
                type="email" 
                required 
                defaultValue={defaultValues.email ?? ""} 
                className="input-fiori" 
                placeholder="email@exemplo.com"
              />
            </div>
            <div>
              <label className="label-fiori">Telefone</label>
              <input 
                name="phone" 
                defaultValue={defaultValues.phone ?? ""} 
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
              <label className="label-fiori">Canal/Origem</label>
              <select 
                name="sales_channel" 
                defaultValue={defaultValues.sales_channel ?? ""} 
                className="select-fiori"
              >
                <option value="">Selecione...</option>
                <option value="WHATSAPP">WhatsApp</option>
                <option value="INSTAGRAM">Instagram</option>
                <option value="SITE">Site</option>
                <option value="FEIRA">Feira</option>
                <option value="INDICACAO">Indicação</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Método de Pagamento (padrão)</label>
              <select 
                name="payment_method_pref" 
                defaultValue={defaultValues.payment_method_pref ?? ""} 
                className="select-fiori"
              >
                <option value="">Selecione...</option>
                <option value="PIX">PIX</option>
                <option value="BOLETO">Boleto</option>
                <option value="CARTAO">Cartão</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="TRANSFERENCIA">Transferência</option>
              </select>
            </div>
            <div>
              <label className="label-fiori">Condição de Pagamento (padrão)</label>
              <select 
                name="payment_terms" 
                defaultValue={defaultValues.payment_terms ?? ""} 
                className="select-fiori"
              >
                <option value="">Selecione...</option>
                <option value="AVISTA">À vista</option>
                <option value="7">7 dias</option>
                <option value="14">14 dias</option>
                <option value="30">30 dias</option>
                <option value="30/60">30/60</option>
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
            <div>
              <label className="label-fiori">Inscrição Estadual (IE)</label>
              <input 
                name="state_registration" 
                defaultValue={defaultValues.state_registration ?? ""} 
                className="input-fiori" 
              />
            </div>
            <div>
              <label className="label-fiori">Inscrição Municipal (IM)</label>
              <input 
                name="municipal_registration" 
                defaultValue={defaultValues.municipal_registration ?? ""} 
                className="input-fiori" 
              />
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
