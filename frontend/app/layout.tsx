export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <head>
        <title>ERP LaPlata</title>
        <meta name="description" content="Sistema ERP completo para gestão empresarial" />
      </head>
      <body style={{fontFamily:'ui-sans-serif', margin:0, backgroundColor:'#f8fafc'}}>
        <header style={{backgroundColor:'#1e40af', color:'white', padding:'1rem 2rem', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', maxWidth:'1200px', margin:'0 auto'}}>
            <h1 style={{margin:0, fontSize:'1.5rem', fontWeight:'bold'}}>ERP LaPlata</h1>
            <nav style={{display:'flex', gap:'1rem', flexWrap:'wrap'}}>
              <a href="/" style={{color:'white', textDecoration:'none', padding:'0.5rem', borderRadius:'4px', transition:'background-color 0.2s'}}>Home</a>
              <a href="/mm/catalog" style={{color:'white', textDecoration:'none', padding:'0.5rem', borderRadius:'4px', transition:'background-color 0.2s'}}>Catálogo</a>
              <a href="/analytics" style={{color:'white', textDecoration:'none', padding:'0.5rem', borderRadius:'4px', transition:'background-color 0.2s'}}>Analytics</a>
            </nav>
          </div>
        </header>
        
        <nav style={{backgroundColor:'white', borderBottom:'1px solid #e5e7eb', padding:'0.5rem 2rem'}}>
          <div style={{maxWidth:'1200px', margin:'0 auto', display:'flex', gap:'1rem', flexWrap:'wrap', fontSize:'0.875rem'}}>
            <div style={{fontWeight:'600', color:'#374151'}}>Módulos:</div>
            <a href="/co/dashboard" style={{color:'#6b7280', textDecoration:'none'}}>Controle</a>
            <a href="/mm/catalog" style={{color:'#6b7280', textDecoration:'none'}}>Materiais</a>
            <a href="/sd" style={{color:'#6b7280', textDecoration:'none'}}>Vendas</a>
            <a href="/wh/inventory" style={{color:'#6b7280', textDecoration:'none'}}>Estoque</a>
            <a href="/crm/leads" style={{color:'#6b7280', textDecoration:'none'}}>CRM</a>
            <a href="/fi/payables" style={{color:'#6b7280', textDecoration:'none'}}>Financeiro</a>
          </div>
        </nav>
        
        <main style={{padding:'2rem', maxWidth:'1200px', margin:'0 auto'}}>{children}</main>
      </body>
    </html>
  )
}
