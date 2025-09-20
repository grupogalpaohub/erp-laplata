'use client'
import { useFormState, useFormStatus } from 'react-dom'
import { createMaterial } from './actions'

type Vendor = { mm_vendor_id: string, name?: string | null }

function SubmitBtn() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="col-span-2 bg-blue-600 text-white p-2 rounded disabled:opacity-60"
    >
      {pending ? 'Salvando…' : 'Salvar'}
    </button>
  )
}

export default function FormCadastro({ vendors }: { vendors: Vendor[] }) {
  const [state, formAction] = useFormState(createMaterial, { ok: false, error: undefined })

  return (
    <main className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-xl font-bold">Cadastro de Materiais</h1>

      {state?.error && (
        <div className="border border-red-300 bg-red-50 text-red-700 rounded p-3">
          {state.error}
        </div>
      )}
      {state?.ok && (
        <div className="border border-green-300 bg-green-50 text-green-700 rounded p-3">
          Material cadastrado com sucesso.
        </div>
      )}

      <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="text-sm font-medium">SKU (mm_material)*</label>
          <input name="mm_material" className="border rounded p-2" required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Nome Comercial (mm_comercial)</label>
          <input name="mm_comercial" className="border rounded p-2" />
        </div>

        <div className="md:col-span-2 flex flex-col">
          <label className="text-sm font-medium">Descrição (mm_desc)*</label>
          <textarea name="mm_desc" className="border rounded p-2" rows={3} required />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Tipo (mm_mat_type)</label>
          <select name="mm_mat_type" className="border rounded p-2">
            <option value="">—</option>
            <option value="raw_material">Matéria Prima</option>
            <option value="finished_good">Produto Acabado</option>
            <option value="component">Componente</option>
            <option value="service">Serviço</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Classe (mm_mat_class)</label>
          <select name="mm_mat_class" className="border rounded p-2">
            <option value="">—</option>
            <option value="prata">Prata</option>
            <option value="ouro">Ouro</option>
            <option value="acabamento">Acabamento</option>
            <option value="embalagem">Embalagem</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Preço (centavos) - mm_price_cents</label>
          <input name="mm_price_cents" inputMode="numeric" pattern="[0-9]*" className="border rounded p-2" placeholder="ex: 1999 para R$ 19,99" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Lead Time (dias) - lead_time_days</label>
          <input name="lead_time_days" inputMode="numeric" pattern="[0-9]*" className="border rounded p-2" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">Fornecedor (mm_vendor_id)</label>
          <select name="mm_vendor_id" className="border rounded p-2">
            <option value="">—</option>
            {vendors.map(v => (
              <option key={v.mm_vendor_id} value={v.mm_vendor_id}>
                {v.name ?? v.mm_vendor_id}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">commercial_name</label>
          <input name="commercial_name" className="border rounded p-2" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-medium">status</label>
          <select name="status" className="border rounded p-2" defaultValue="active">
            <option value="active">active</option>
            <option value="inactive">inactive</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <SubmitBtn />
        </div>
      </form>
    </main>
  )
}
