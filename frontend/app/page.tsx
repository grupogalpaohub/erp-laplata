export default function Home() {
  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Controle</h2>
      <ul style={{ marginTop: 12 }}>
        <li><a href="/mm/catalog">Catálogo de Materiais</a></li>
        <li><a href="/mm/vendors">Fornecedores</a></li>
        <li><a href="/mm/purchases">Pedidos de Compra</a></li>
        <li><a href="/mm/receiving">Recebimentos</a></li>
        <li><a href="/wh/inventory">Inventário</a></li>
      </ul>
      <p style={{ marginTop: 16, color:'#666' }}>Módulos de Vendas, CRM e Financeiro entram na próxima etapa.</p>
    </main>
  )
}
