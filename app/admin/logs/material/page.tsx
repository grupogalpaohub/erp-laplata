export const runtime = 'nodejs'
import { createClient } from '@/src/lib/supabase/server'

export default async function MaterialLogsPage() {
  const supabase = createClient()

  // Consolidar: preço + campos (duas tabelas)
  const [{ data: price }, { data: change }] = await Promise.all([
    supabase.from('mm_price_log').select('mm_material, old_price, new_price, changed_at, changed_by').order('changed_at', { ascending: false }),
    supabase.from('mm_change_log').select('record_id, field_name, old_value, new_value, changed_at, changed_by').order('changed_at', { ascending: false })
  ])

  return (
    <main className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Log de Mudanças (Materiais)</h1>
        <a href="/api/export/material-logs" className="px-3 py-2 rounded bg-[#062238] text-white">Exportar CSV</a>
      </div>

      <section>
        <h2 className="text-lg font-semibold mb-2">Alterações de Preço</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">Material</th>
                <th className="p-2 border">De</th>
                <th className="p-2 border">Para</th>
                <th className="p-2 border">Quando</th>
                <th className="p-2 border">Por</th>
              </tr>
            </thead>
            <tbody>
            {(price ?? []).map((r:any, idx:number) => (
              <tr key={idx}>
                <td className="p-2 border font-mono">{r.mm_material}</td>
                <td className="p-2 border text-right">R$ {(Number(r.old_price||0)/100).toFixed(2)}</td>
                <td className="p-2 border text-right">R$ {(Number(r.new_price||0)/100).toFixed(2)}</td>
                <td className="p-2 border">{new Date(r.changed_at).toLocaleString()}</td>
                <td className="p-2 border">{r.changed_by ?? '-'}</td>
              </tr>
            ))}
            {(!price || price.length===0) && <tr><td className="p-3 text-center text-gray-500" colSpan={5}>Sem registros</td></tr>}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Alterações de Campos</h2>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-2 border">Material</th>
                <th className="p-2 border">Campo</th>
                <th className="p-2 border">De</th>
                <th className="p-2 border">Para</th>
                <th className="p-2 border">Quando</th>
                <th className="p-2 border">Por</th>
              </tr>
            </thead>
            <tbody>
            {(change ?? []).map((r:any, idx:number) => (
              <tr key={idx}>
                <td className="p-2 border font-mono">{r.record_id}</td>
                <td className="p-2 border">{r.field_name}</td>
                <td className="p-2 border">{r.old_value ?? '-'}</td>
                <td className="p-2 border">{r.new_value ?? '-'}</td>
                <td className="p-2 border">{new Date(r.changed_at).toLocaleString()}</td>
                <td className="p-2 border">{r.changed_by ?? '-'}</td>
              </tr>
            ))}
            {(!change || change.length===0) && <tr><td className="p-3 text-center text-gray-500" colSpan={6}>Sem registros</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}
