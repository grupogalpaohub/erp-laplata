// app/mm/catalog/page.tsx
import { getMaterials } from '@/lib/data/materials';

export const revalidate = 0; // sempre ler do banco

export default async function Page() {
  const rows = await getMaterials(300);

  return (
    <main style={{maxWidth: 1080, margin: '1.5rem auto', padding: '0 1rem'}}>
      <h1>Catálogo</h1>

      {rows.length === 0 ? (
        <p>Nenhum material encontrado.</p>
      ) : (
        <table style={{width:'100%', borderCollapse:'collapse'}}>
          <thead>
            <tr>
              <th style={th}>Código</th>
              <th style={th}>Nome Comercial</th>
              <th style={th}>Tipo</th>
              <th style={th}>Classe</th>
              <th style={{...th, textAlign:'right'}}>Preço (R$)</th>
              <th style={th}>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const name = r.commercial_name ?? r.mm_comercial ?? '';
              return (
                <tr key={`${r.tenant_id}:${r.mm_material}`}>
                  <td style={td}>{r.mm_material}</td>
                  <td style={td}>{name}</td>
                  <td style={td}>{r.mm_mat_type}</td>
                  <td style={td}>{r.mm_mat_class}</td>
                  <td style={{...td, textAlign:'right'}}>
                    {typeof r.mm_price_cents === 'number'
                      ? (r.mm_price_cents / 100).toFixed(2)
                      : '-'}
                  </td>
                  <td style={td}>{r.status ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </main>
  );
}

const th: React.CSSProperties = {
  textAlign: 'left',
  borderBottom: '1px solid #eaeaea',
  padding: '8px',
  fontWeight: 600,
};
const td: React.CSSProperties = {
  borderBottom: '1px solid #f2f2f2',
  padding: '8px',
};
