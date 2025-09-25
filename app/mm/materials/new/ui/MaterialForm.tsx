"use client";
import { useTransition } from "react";
import { createMaterial } from "../../_actions";
import MaterialTypeSelect from "@/components/MaterialTypeSelect";

export function MaterialForm() {
  const [pending, start] = useTransition();
  return (
    <form action={(fd) => start(() => createMaterial(fd))} className="max-w-xl space-y-3">
      <div>
        <label className="block text-sm mb-1">Código</label>
        <input name="mm_material" required className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block text-sm mb-1">Nome</label>
        <input name="name" required className="border rounded px-3 py-2 w-full" />
      </div>
      <div>
        <label className="block text-sm mb-1">Tipo de Material</label>
        <MaterialTypeSelect name="mm_mat_type" id="mm_mat_type" className="border rounded px-2 py-1 w-full" required />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm mb-1">Preço venda (R$)</label>
          <input name="mm_price" placeholder="Ex: 48,90" required className="border rounded px-3 py-2 w-full" />
        </div>
        <div>
          <label className="block text-sm mb-1">Preço compra (R$)</label>
          <input name="mm_purchase_price" placeholder="Ex: 36,00" className="border rounded px-3 py-2 w-full" />
        </div>
      </div>
      <button disabled={pending} className="bg-blue-600 text-white px-4 py-2 rounded">
        {pending ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
