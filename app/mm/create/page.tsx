"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/src/lib/supabase/client";
import { getTenantId } from "@/src/lib/auth";

export default function CreateMaterial() {
  const [form, setForm] = useState({
    mm_material: "",
    mm_comercial: "",
    mm_desc: "",
    mm_mat_type: "raw_material" as "raw_material" | "finished_good" | "component" | "service",
    mm_mat_class: "prata" as "prata" | "ouro" | "acabamento" | "embalagem",
    mm_price_cents: "",
    barcode: "",
    weight_grams: "",
    status: "active",
    mm_pur_link: "",
    mm_vendor_id: "",
    commercial_name: "",
    unit_of_measure: "unidade",
    dimensions: "",
    purity: "",
    color: "",
    finish: "",
    min_stock: "0",
    max_stock: "1000",
    lead_time_days: "7"
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = supabaseBrowser();
      const tenantId = await getTenantId();

      // Validar campos obrigatórios
      if (!form.mm_material || !form.mm_desc) {
        setError("SKU e Descrição são obrigatórios");
        setLoading(false);
        return;
      }

      // Converter campos numéricos
      const materialData = {
        ...form,
        tenant_id: tenantId,
        mm_price_cents: form.mm_price_cents ? parseInt(form.mm_price_cents) * 100 : 0,
        weight_grams: form.weight_grams ? parseInt(form.weight_grams) : null,
        min_stock: parseInt(form.min_stock),
        max_stock: parseInt(form.max_stock),
        lead_time_days: parseInt(form.lead_time_days)
      };

      const { error: insertError } = await supabase
        .from("mm_material")
        .insert([materialData]);

      if (insertError) {
        console.error("Erro ao salvar material:", insertError);
        setError(`Erro ao salvar: ${insertError.message}`);
      } else {
        alert("Material cadastrado com sucesso!");
        // Limpar formulário
        setForm({
          mm_material: "",
          mm_comercial: "",
          mm_desc: "",
          mm_mat_type: "raw_material",
          mm_mat_class: "prata",
          mm_price_cents: "",
          barcode: "",
          weight_grams: "",
          status: "active",
          mm_pur_link: "",
          mm_vendor_id: "",
          commercial_name: "",
          unit_of_measure: "unidade",
          dimensions: "",
          purity: "",
          color: "",
          finish: "",
          min_stock: "0",
          max_stock: "1000",
          lead_time_days: "7"
        });
      }
    } catch (err) {
      console.error("Erro inesperado:", err);
      setError("Erro inesperado ao salvar material");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Cadastro de Materiais</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Campos obrigatórios */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              SKU (Código do Material) *
            </label>
            <input
              type="text"
              value={form.mm_material}
              onChange={(e) => setForm({ ...form, mm_material: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nome Comercial
            </label>
            <input
              type="text"
              value={form.mm_comercial}
              onChange={(e) => setForm({ ...form, mm_comercial: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Descrição *
            </label>
            <textarea
              value={form.mm_desc}
              onChange={(e) => setForm({ ...form, mm_desc: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Tipo de Material
            </label>
            <select
              value={form.mm_mat_type}
              onChange={(e) => setForm({ ...form, mm_mat_type: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="raw_material">Matéria Prima</option>
              <option value="finished_good">Produto Acabado</option>
              <option value="component">Componente</option>
              <option value="service">Serviço</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Classificação
            </label>
            <select
              value={form.mm_mat_class}
              onChange={(e) => setForm({ ...form, mm_mat_class: e.target.value as any })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="prata">Prata</option>
              <option value="ouro">Ouro</option>
              <option value="acabamento">Acabamento</option>
              <option value="embalagem">Embalagem</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.mm_price_cents}
              onChange={(e) => setForm({ ...form, mm_price_cents: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Código de Barras
            </label>
            <input
              type="text"
              value={form.barcode}
              onChange={(e) => setForm({ ...form, barcode: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Peso (gramas)
            </label>
            <input
              type="number"
              value={form.weight_grams}
              onChange={(e) => setForm({ ...form, weight_grams: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              ID do Fornecedor
            </label>
            <input
              type="text"
              value={form.mm_vendor_id}
              onChange={(e) => setForm({ ...form, mm_vendor_id: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Nome Comercial (Alternativo)
            </label>
            <input
              type="text"
              value={form.commercial_name}
              onChange={(e) => setForm({ ...form, commercial_name: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Unidade de Medida
            </label>
            <input
              type="text"
              value={form.unit_of_measure}
              onChange={(e) => setForm({ ...form, unit_of_measure: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Dimensões
            </label>
            <input
              type="text"
              value={form.dimensions}
              onChange={(e) => setForm({ ...form, dimensions: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Pureza
            </label>
            <input
              type="text"
              value={form.purity}
              onChange={(e) => setForm({ ...form, purity: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Cor
            </label>
            <input
              type="text"
              value={form.color}
              onChange={(e) => setForm({ ...form, color: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Acabamento
            </label>
            <input
              type="text"
              value={form.finish}
              onChange={(e) => setForm({ ...form, finish: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Estoque Mínimo
            </label>
            <input
              type="number"
              value={form.min_stock}
              onChange={(e) => setForm({ ...form, min_stock: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Estoque Máximo
            </label>
            <input
              type="number"
              value={form.max_stock}
              onChange={(e) => setForm({ ...form, max_stock: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Lead Time (dias)
            </label>
            <input
              type="number"
              value={form.lead_time_days}
              onChange={(e) => setForm({ ...form, lead_time_days: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">
              Link de Compra
            </label>
            <input
              type="url"
              value={form.mm_pur_link}
              onChange={(e) => setForm({ ...form, mm_pur_link: e.target.value })}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Salvando..." : "Salvar Material"}
          </button>
        </div>
      </form>
    </main>
  );
}
