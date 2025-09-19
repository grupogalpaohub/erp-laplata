// src/app/mm/catalog/page.tsx
import { supabaseServer } from "@/lib/supabase/server";

export default async function CatalogPage() {
  const sb = supabaseServer();

  // use a view de leitura que você já tem (RLS-friendly)
  const { data, error } = await sb
    .from("v_material_overview")
    .select("tenant_id, sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents")
    .order("sku", { ascending: true })
    .limit(200);

  if (error) {
    return <pre>Erro ao carregar catálogo: {error.message}</pre>;
  }

  if (!data || data.length === 0) {
    return <p>Nenhum material encontrado.</p>;
  }

  return (
    <main className="p-6">
      <h1>Catálogo de Materiais</h1>
      <table className="mt-4 w-full border-collapse">
        <thead>
          <tr>
            <th className="border p-2">SKU</th>
            <th className="border p-2">Nome</th>
            <th className="border p-2">Tipo</th>
            <th className="border p-2">Classe</th>
            <th className="border p-2">Preço</th>
          </tr>
        </thead>
        <tbody>
          {data.map((m) => (
            <tr key={`${m.tenant_id}-${m.sku}`}>
              <td className="border p-2">{m.sku}</td>
              <td className="border p-2">{m.mm_comercial}</td>
              <td className="border p-2">{m.mm_mat_type}</td>
              <td className="border p-2">{m.mm_mat_class}</td>
              <td className="border p-2">
                {(Number(m.sales_price_cents) / 100).toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
