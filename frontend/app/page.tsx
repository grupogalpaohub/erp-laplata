export default function Page(){ 
  return (
    <div style={{display:'grid', gap:'2rem'}}>
      <div style={{textAlign:'center', padding:'2rem 0'}}>
        <h1 style={{fontSize:'2.5rem', fontWeight:'bold', color:'#1e40af', margin:'0 0 1rem 0'}}>
          ERP LaPlata
        </h1>
        <p style={{fontSize:'1.25rem', color:'#6b7280', margin:'0 0 2rem 0'}}>
          Sistema completo de gestão empresarial
        </p>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))', gap:'1.5rem'}}>
        <div style={{backgroundColor:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 1rem 0', color:'#1e40af'}}>📦 Gestão de Materiais</h3>
          <p style={{color:'#6b7280', margin:'0 0 1rem 0'}}>Controle completo de catálogo, fornecedores e compras</p>
          <a href="/mm/catalog" style={{color:'#1e40af', textDecoration:'none', fontWeight:'500'}}>Ver Catálogo →</a>
        </div>

        <div style={{backgroundColor:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 1rem 0', color:'#1e40af'}}>🛒 Vendas</h3>
          <p style={{color:'#6b7280', margin:'0 0 1rem 0'}}>Gestão de pedidos, clientes e faturas</p>
          <a href="/sd" style={{color:'#1e40af', textDecoration:'none', fontWeight:'500'}}>Ver Vendas →</a>
        </div>

        <div style={{backgroundColor:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 1rem 0', color:'#1e40af'}}>📊 Analytics</h3>
          <p style={{color:'#6b7280', margin:'0 0 1rem 0'}}>Relatórios e dashboards em tempo real</p>
          <a href="/analytics" style={{color:'#1e40af', textDecoration:'none', fontWeight:'500'}}>Ver Analytics →</a>
        </div>

        <div style={{backgroundColor:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 1rem 0', color:'#1e40af'}}>🏪 Estoque</h3>
          <p style={{color:'#6b7280', margin:'0 0 1rem 0'}}>Controle de inventário e movimentações</p>
          <a href="/wh/inventory" style={{color:'#1e40af', textDecoration:'none', fontWeight:'500'}}>Ver Estoque →</a>
        </div>

        <div style={{backgroundColor:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 1rem 0', color:'#1e40af'}}>👥 CRM</h3>
          <p style={{color:'#6b7280', margin:'0 0 1rem 0'}}>Gestão de leads e oportunidades</p>
          <a href="/crm/leads" style={{color:'#1e40af', textDecoration:'none', fontWeight:'500'}}>Ver CRM →</a>
        </div>

        <div style={{backgroundColor:'white', padding:'1.5rem', borderRadius:'8px', boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <h3 style={{margin:'0 0 1rem 0', color:'#1e40af'}}>💰 Financeiro</h3>
          <p style={{color:'#6b7280', margin:'0 0 1rem 0'}}>Contas a pagar, receber e fluxo de caixa</p>
          <a href="/fi/payables" style={{color:'#1e40af', textDecoration:'none', fontWeight:'500'}}>Ver Financeiro →</a>
        </div>
      </div>

      <div style={{textAlign:'center', padding:'2rem 0', color:'#6b7280'}}>
        <p>✅ Sistema funcionando perfeitamente no Vercel</p>
        <p>🔗 Conectado ao Supabase</p>
        <p>🚀 Deploy automático ativo</p>
      </div>
    </div>
  )
}
