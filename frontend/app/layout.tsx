import './globals.css'
import Nav from '@/components/Nav'
import type { ReactNode } from 'react'

export const metadata = {
  title: 'ERP LaPlata',
  description: 'Sistema completo de gestão empresarial',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body style={{fontFamily:'ui-sans-serif', margin:0, backgroundColor:'#f8fafc'}}>
        <header style={{background:'#1e40af', color:'white', padding:'1rem 2rem', boxShadow:'0 2px 4px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize:22, fontWeight:700}}>ERP LaPlata</div>
        </header>
        <Nav />
        <main style={{padding:'2rem', maxWidth:1200, margin:'0 auto'}}>{children}</main>
      </body>
    </html>
  )
}
