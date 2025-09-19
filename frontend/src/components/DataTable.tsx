'use client'
import * as React from 'react'

type Props = {
  rows: Record<string, any>[]
  columns?: string[] // opcional: forçar ordem
  emptyLabel?: string
}
export function DataTable({ rows, columns, emptyLabel }: Props) {
  if (!rows || rows.length === 0) return <p>{emptyLabel ?? 'Nenhum registro encontrado.'}</p>
  const cols = columns && columns.length ? columns : Array.from(new Set(rows.flatMap(r => Object.keys(r))))
  return (
    <div style={{ overflowX:'auto' }}>
      <table cellPadding={8} style={{ borderCollapse:'collapse', width:'100%', minWidth: 960 }}>
        <thead>
          <tr>
            {cols.map(c => <th key={c} style={{ textAlign:'left', borderBottom:'1px solid #eee', fontWeight:600 }}>{c}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} style={{ borderBottom:'1px solid #f6f6f6' }}>
              {cols.map(c => <td key={c} style={{ verticalAlign:'top' }}>{formatCell(r[c])}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function formatCell(v: any) {
  if (v === null || v === undefined) return ''
  if (typeof v === 'number') return v
  if (typeof v === 'object') return JSON.stringify(v)
  return String(v)
}
