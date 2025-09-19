import Link from "next/link";
import { getMaterials } from "@/src/lib/db/options";

export const revalidate = 0

export default async function MaterialsList(){
  const data = await getMaterials()
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Materiais</h1>
        <Link className="underline" href="/mm/materials/new">Novo</Link>
      </div>
      {(!data || data.length===0) ? <div>Nenhum registro encontrado.</div> : (
        <table className="min-w-full">
          <thead className="bg-gray-50"><tr>
            <th className="px-2 py-1 text-left">SKU</th>
            <th className="px-2 py-1 text-left">Comercial</th>
            <th className="px-2 py-1 text-left">Tipo</th>
            <th className="px-2 py-1 text-left">Classe</th>
            <th className="px-2 py-1 text-left">Preço (centavos)</th>
            <th className="px-2 py-1 text-left">Status</th>
            <th></th>
          </tr></thead>
          <tbody>
            {data.map((r:any)=>(
              <tr key={r.mm_material} className="border-t">
                <td className="px-2 py-1">{r.mm_material}</td>
                <td className="px-2 py-1">{r.mm_comercial}</td>
                <td className="px-2 py-1">{r.mm_mat_type}</td>
                <td className="px-2 py-1">{r.mm_mat_class}</td>
                <td className="px-2 py-1">{r.mm_price_cents}</td>
                <td className="px-2 py-1">{r.status}</td>
                <td className="px-2 py-1"><Link className="underline" href={`/mm/materials/${encodeURIComponent(r.mm_material)}`}>Editar</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
