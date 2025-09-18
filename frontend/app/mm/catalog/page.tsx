import { supabaseServer } from "@/lib/supabase/server";

type Row = {
  tenant_id: string;
  sku: string | null;
  mm_comercial: string | null;
  mm_mat_type: string | null;
  mm_mat_class: string | null;
  sales_price_cents: number | null;
  avg_unit_cost_cents: number | null;
};

export const dynamic = "force-dynamic"; // evita cache agressivo em produção

export default async function CatalogPage() {
  const sb = supabaseServer();

  // Use a VIEW (security definer) já existente no seu projeto:
  const { data, error } = await sb
    .from("v_material_overview")
    .select("tenant_id, sku, mm_comercial, mm_mat_type, mm_mat_class, sales_price_cents, avg_unit_cost_cents")
    .order("sku", { ascending: true })
    .limit(200);

  if (error) {
    // não quebrar o render: mostrar msg amigável
    return (
      <main style={{padding:"24px"}}>
        <h1>Catálogo de Materiais</h1>
        <p style={{color:"#b00"}}>Erro ao consultar catálogo: {error.message}</p>
        <p>Diagnóstico rápido: acesse <code>/api/diag/supabase</code> para ver env/permissões.</p>
      </main>
    );
  }

  const rows = (data ?? []) as Row[];

  return (
    <main style={{padding:"24px"}}>
      <h1>Catálogo de Materiais</h1>
      {rows.length === 0 ? (
        <p>Nenhum material encontrado.</p>
      ) : (
        <table style={{borderCollapse:"collapse",minWidth:900,marginTop:12}}>
          <thead>
            <tr>
              <th style={{textAlign:"left",borderBottom:"1px solid #ddd",padding:"8px"}}>SKU</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #ddd",padding:"8px"}}>Nome Comercial</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #ddd",padding:"8px"}}>Tipo</th>
              <th style={{textAlign:"left",borderBottom:"1px solid #ddd",padding:"8px"}}>Classe</th>
              <th style={{textAlign:"right",borderBottom:"1px solid #ddd",padding:"8px"}}>Preço (R$)</th>
              <th style={{textAlign:"right",borderBottom:"1px solid #ddd",padding:"8px"}}>Custo (R$)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td style={{padding:"8px",borderBottom:"1px solid #f0f0f0"}}>{r.sku ?? "-"}</td>
                <td style={{padding:"8px",borderBottom:"1px solid #f0f0f0"}}>{r.mm_comercial ?? "-"}</td>
                <td style={{padding:"8px",borderBottom:"1px solid #f0f0f0"}}>{r.mm_mat_type ?? "-"}</td>
                <td style={{padding:"8px",borderBottom:"1px solid #f0f0f0"}}>{r.mm_mat_class ?? "-"}</td>
                <td style={{padding:"8px",textAlign:"right",borderBottom:"1px solid #f0f0f0"}}>
                  {r.sales_price_cents != null ? (r.sales_price_cents/100).toFixed(2) : "-"}
                </td>
                <td style={{padding:"8px",textAlign:"right",borderBottom:"1px solid #f0f0f0"}}>
                  {r.avg_unit_cost_cents != null ? (r.avg_unit_cost_cents/100).toFixed(2) : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
