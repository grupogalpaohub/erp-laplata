type Col<T> = { key: keyof T; header: string; width?: string }
export function DataTable<T extends Record<string, any>>({
  columns, rows, emptyText = 'Nenhum registro encontrado.'
}: { columns: Col<T>[]; rows: T[]; emptyText?: string }) {
  if (!rows || rows.length === 0) {
    return <p style={{ padding: 8, color: '#666' }}>{emptyText}</p>
  }
  return (
    <div style={{ overflowX: 'auto' }}>
      <table cellPadding={6} style={{ borderCollapse:'collapse', width:'100%', minWidth:720 }}>
        <thead>
          <tr>
            {columns.map((c,i)=>(
              <th key={i} style={{ textAlign:'left', borderBottom:'1px solid #eee', whiteSpace:'nowrap', width:c.width }}>{c.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r,i)=>(
            <tr key={i} style={{ borderBottom:'1px solid #f2f2f2' }}>
              {columns.map((c,j)=>(
                <td key={j} style={{ whiteSpace:'nowrap' }}>
                  {r[c.key] as any}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
