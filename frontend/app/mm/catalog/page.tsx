// app/mm/catalog/page.tsx
import { supabaseServer } from "@/lib/supabase/server";

type Row = {
  tenant_id: string;
  sku: string | null;
  mm_comercial: string | null;
  mm_mat_type: string | null;
  mm_mat_class: string | null;
  sales_price_cents: number | null;
};

export const revalidate = 30; // ISR

export default async function Catalog() {
  const sb = supabaseServer();
  // Lê do VIEW (sem mexer em schema/tabelas)
  const { data, error } = await sb.from("v_material_overview" as any)
    .select("tenant_id, sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents")
    .order("mm_comercial", { ascending: true })
    .limit(300);

  if (error) {
    return <pre className="text-red-600">Erro ao carregar catálogo: {error.message}</pre>;
  }

  if (!data || data.length === 0) {
    return <div className="rounded-xl border bg-white p-4">Nenhum material encontrado.</div>;
  }

  return (
    <div className="rounded-xl border bg-white">
      <div className="p-4 border-b font-semibold">Catálogo de Materiais</div>
      <table className="w-full text-sm">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="p-2 text-left">SKU</th>
            <th className="p-2 text-left">Nome</th>
            <th className="p-2 text-left">Tipo</th>
            <th className="p-2 text-left">Classe</th>
            <th className="p-2 text-right">Preço</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r: Row) => (
            <tr key={`${r.tenant_id}-${r.sku}`} className="border-t">
              <td className="p-2">{r.sku}</td>
              <td className="p-2">{r.mm_comercial}</td>
              <td className="p-2">{r.mm_mat_type}</td>
              <td className="p-2">{r.mm_mat_class}</td>
              <td className="p-2 text-right">
                {r.sales_price_cents != null ? (r.sales_price_cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
