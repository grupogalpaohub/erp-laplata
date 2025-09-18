export default function RootLayout({children}:{children:React.ReactNode}) {
  return (
    <html lang="pt-BR">
      <body style={{fontFamily:'ui-sans-serif', margin:0}}>
        <nav style={{padding:12,borderBottom:'1px solid #eee',display:'flex',gap:12,flexWrap:'wrap'}}>
          <a href="/">home</a>
          <a href="/login">login</a>
          <a href="/setup">setup</a>
          <a href="/analytics">analytics</a>
          <a href="/co/dashboard">co/dashboard</a>
          <a href="/co/reports">co/reports</a>
          <a href="/co/costs">co/costs</a>
          <a href="/mm/catalog">mm/catalog</a>
          <a href="/mm/vendors">mm/vendors</a>
          <a href="/mm/purchases">mm/purchases</a>
          <a href="/sd">sd</a>
          <a href="/sd/orders">sd/orders</a>
          <a href="/sd/customers">sd/customers</a>
          <a href="/sd/invoices">sd/invoices</a>
          <a href="/wh/inventory">wh/inventory</a>
          <a href="/wh/movements">wh/movements</a>
          <a href="/wh/reports">wh/reports</a>
          <a href="/crm/leads">crm/leads</a>
          <a href="/crm/opportunities">crm/opportunities</a>
          <a href="/crm/activities">crm/activities</a>
          <a href="/fi/payables">fi/payables</a>
          <a href="/fi/receivables">fi/receivables</a>
          <a href="/fi/cashflow">fi/cashflow</a>
        </nav>
        <main style={{padding:24}}>{children}</main>
      </body>
    </html>
  )
}
