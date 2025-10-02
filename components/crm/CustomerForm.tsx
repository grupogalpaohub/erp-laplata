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
            <div>
              <label className="label-fiori">Nome do Contato</label>
              <input 
                name="contact_name" 
                defaultValue={defaultValues.contact_name ?? ""} 
                className="input-fiori" 
                placeholder="Nome da pessoa de contato" 
              />
            </div>
            <div>
              <label className="label-fiori">E-mail do Contato</label>
              <input 
                name="contact_email" 
                type="email" 
                defaultValue={defaultValues.contact_email ?? ""} 
                className="input-fiori" 
                placeholder="contato@exemplo.com" 
              />
            </div>
            <div>
              <label className="label-fiori">Telefone do Contato</label>
              <input 
                name="contact_phone" 
                defaultValue={defaultValues.contact_phone ?? ""} 
                className="input-fiori" 
                placeholder="(11) 99999-9999" 
              />
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
