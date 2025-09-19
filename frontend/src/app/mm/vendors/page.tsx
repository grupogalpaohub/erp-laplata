import { getVendors } from "@/src/lib/db/options";

export const revalidate = 0

export default async function Vendors(){
  const data = await getVendors()
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Fornecedores</h1>
      {(!data || data.length===0) ? <div>Nenhum registro encontrado.</div> : (
        <table className="min-w-full">
          <thead className="bg-gray-50"><tr>
            <th className="px-2 py-1 text-left">Fornecedor</th>
          </tr></thead>
          <tbody>
            {data.map(v=>(
              <tr key={v.vendor_id} className="border-t"><td className="px-2 py-1">{v.vendor_name}</td></tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}