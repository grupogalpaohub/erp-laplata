export const runtime = 'edge';
export default function RootLayout({children}:{children:React.ReactNode}){
  return (
    <html lang="pt-BR"><body>
      <nav style={{padding:12,borderBottom:'1px solid #eee',display:'flex',gap:12,flexWrap:'wrap'}}>
        <a href="/">/</a>
        <a href="/login">/login</a>
        <a href="/setup">/setup</a>
        <a href="/analytics">/analytics</a>
        <a href="/co/dashboard">/co/dashboard</a>
        <a href="/mm/catalog">/mm/catalog</a>
        <a href="/sd">/sd</a>
        <a href="/wh/inventory">/wh/inventory</a>
        <a href="/crm/leads">/crm/leads</a>
        <a href="/fi/payables">/fi/payables</a>
      </nav>
      <main style={{padding:24}}>{children}</main>
    </body></html>
  );
}
