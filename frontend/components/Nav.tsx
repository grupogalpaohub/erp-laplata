'use client'
import Link from 'next/link'

export default function Nav() {
  const links = [
    ['Home','/'],
    ['Catálogo','/mm/catalog'],
    ['Fornecedores','/mm/vendors'],
    ['Compras','/mm/purchases'],
    ['Vendas','/sd'],
    ['Estoque','/wh/inventory'],
    ['Analytics','/analytics'],
    ['Login','/login'],
  ]
  return (
    <nav style={{background:'white', borderBottom:'1px solid #e5e7eb', padding:'0.5rem 2rem', display:'flex', gap:14}}>
      {links.map(([label,href]) => (
        <Link key={href} href={href} style={{textDecoration:'none'}}>{label}</Link>
      ))}
    </nav>
  )
}
