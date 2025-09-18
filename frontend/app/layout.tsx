import './globals.css';
import Link from 'next/link';

export const metadata = {
  title: 'ERP LaPlata',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const links = [
    { href: '/', label: 'Home' },
    { href: '/mm/catalog', label: 'Catálogo' },
    { href: '/mm/vendors', label: 'Fornecedores' },
    { href: '/mm/purchases', label: 'Compras' },
    { href: '/sd/orders', label: 'Vendas' },
    { href: '/wh/inventory', label: 'Estoque' },
    { href: '/analytics', label: 'Analytics' },
    { href: '/login', label: 'Login' },
  ];

  return (
    <html lang="pt-BR">
      <body style={{fontFamily:'ui-sans-serif', margin:0, background:'#f8fafc'}}>
        <header style={{background:'#1e40af', color:'white', padding:'1rem 2rem', boxShadow:'0 2px 4px rgba(0,0,0,.1)'}}>
          <div style={{maxWidth:1200, margin:'0 auto', display:'flex', alignItems:'center', gap:16}}>
            <strong style={{fontSize:22}}>ERP LaPlata</strong>
            <nav style={{marginLeft:'auto', display:'flex', gap:12}}>
              {links.map(l => (
                <Link key={l.href} href={l.href} style={{color:'white', textDecoration:'none'}}>
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main style={{maxWidth:1200, margin:'0 auto', padding:'1.5rem 1rem'}}>
          {children}
        </main>
      </body>
    </html>
  );
}
