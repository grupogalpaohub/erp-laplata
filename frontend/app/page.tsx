export default function Home() {
  return (
    <main style={{ padding: '1.25rem' }}>
      <h2>Controle</h2>
      <p>Bem-vindo ao ERP LaPlata.</p>
      <ul style={{ marginTop: 12 }}>
        <li><a href="/mm/catalog">Catálogo de Materiais</a></li>
        <li><a href="/sd">Vendas</a> — (em leitura)</li>
        <li><a href="/wh">Estoque</a> — (em leitura)</li>
        <li><a href="/crm">CRM</a> — (em leitura)</li>
        <li><a href="/fi">Financeiro</a> — (em leitura)</li>
        <li><a href="/analytics">Analytics</a> — (em leitura)</li>
      </ul>
    </main>
  )
}
