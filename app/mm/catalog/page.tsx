"use client";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/src/lib/supabase/client";
import { getTenantId } from "@/src/lib/auth";

type Material = {
  tenant_id: string;
  mm_material: string;
  mm_comercial?: string | null;
  mm_desc: string;
  mm_mat_type?: string | null;
  mm_mat_class?: string | null;
  mm_price_cents?: number | null;
  barcode?: string | null;
  weight_grams?: number | null;
  status?: string | null;
  mm_pur_link?: string | null;
  mm_vendor_id?: string | null;
  commercial_name?: string | null;
  unit_of_measure?: string | null;
  dimensions?: string | null;
  purity?: string | null;
  color?: string | null;
  finish?: string | null;
  min_stock?: number | null;
  max_stock?: number | null;
  lead_time_days?: number | null;
  created_at?: string | null;
};

export default function CatalogoMateriais() {
  const [materiais, setMateriais] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = supabaseBrowser();
        const tenantId = await getTenantId();

        const { data, error } = await supabase
          .from("mm_material")
          .select("*")
          .eq("tenant_id", tenantId)
          .order("mm_material", { ascending: true })
          .limit(300);

        if (error) {
          console.error("Erro ao carregar materiais:", error);
          setError(`Erro ao carregar catálogo: ${error.message}`);
        } else if (data) {
          setMateriais(data);
        }
      } catch (err) {
        console.error("Erro inesperado:", err);
        setError("Erro inesperado ao carregar materiais");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Catálogo de Materiais</h1>
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Carregando materiais...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">Catálogo de Materiais</h1>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Catálogo de Materiais</h1>
      
      {materiais.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Nenhum material encontrado.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 p-2 text-left">SKU</th>
                <th className="border border-gray-300 p-2 text-left">Nome Comercial</th>
                <th className="border border-gray-300 p-2 text-left">Descrição</th>
                <th className="border border-gray-300 p-2 text-left">Tipo</th>
                <th className="border border-gray-300 p-2 text-left">Classe</th>
                <th className="border border-gray-300 p-2 text-left">Preço (R$)</th>
                <th className="border border-gray-300 p-2 text-left">Fornecedor</th>
                <th className="border border-gray-300 p-2 text-left">Status</th>
                <th className="border border-gray-300 p-2 text-left">Lead Time</th>
              </tr>
            </thead>
            <tbody>
              {materiais.map((material) => (
                <tr key={material.mm_material} className="hover:bg-gray-50">
                  <td className="border border-gray-300 p-2 font-mono text-sm">
                    {material.mm_material}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {material.mm_comercial || material.commercial_name || "-"}
                  </td>
                  <td className="border border-gray-300 p-2 max-w-xs truncate">
                    {material.mm_desc}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {material.mm_mat_type || "-"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {material.mm_mat_class || "-"}
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {material.mm_price_cents 
                      ? `R$ ${(material.mm_price_cents / 100).toFixed(2)}` 
                      : "-"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {material.mm_vendor_id || "-"}
                  </td>
                  <td className="border border-gray-300 p-2">
                    <span className={`px-2 py-1 rounded text-xs ${
                      material.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {material.status || "active"}
                    </span>
                  </td>
                  <td className="border border-gray-300 p-2 text-right">
                    {material.lead_time_days ? `${material.lead_time_days} dias` : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
