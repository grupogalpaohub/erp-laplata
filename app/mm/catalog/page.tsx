// app/mm/catalog/page.tsx (Server Component)
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { formatBRL } from "@/lib/money";
import { requireSession } from "@/lib/auth/requireSession";

type Material = {
  mm_material: string;
  name?: string | null;
  mm_comercial?: string | null;
  status?: string | null;
  mm_price_cents?: number | null;
  mm_purchase_price_cents?: number | null;
};

export default async function CatalogPage() {
  await requireSession();
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("mm_material")
    .select("*") // tolerante a variações
    .order("mm_material", { ascending: true })
    .limit(50);

  if (error) throw error;
  const materials = (data ?? []) as Material[];

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Catálogo de Materiais</h1>
      <div className="border rounded-lg overflow-hidden">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left">Código</th>
              <th className="px-3 py-2 text-left">Nome</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Preço Venda</th>
              <th className="px-3 py-2 text-right">Preço Compra</th>
            </tr>
          </thead>
          <tbody>
            {materials.map((m) => (
              <tr key={m.mm_material} className="border-t">
                <td className="px-3 py-2">{m.mm_material}</td>
                <td className="px-3 py-2">{m.name ?? m.mm_comercial ?? "-"}</td>
                <td className="px-3 py-2">{m.status ?? "-"}</td>
                <td className="px-3 py-2 text-right">{formatBRL(m.mm_price_cents ?? 0)}</td>
                <td className="px-3 py-2 text-right">{formatBRL(m.mm_purchase_price_cents ?? 0)}</td>
              </tr>
            ))}
            {materials.length === 0 && (
              <tr>
                <td className="px-3 py-6 text-center text-gray-500" colSpan={5}>
                  Nenhum material encontrado (faça login DEV: POST /auth/dev-login).
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}