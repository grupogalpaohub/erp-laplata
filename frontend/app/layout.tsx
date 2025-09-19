import type { Metadata } from 'next'
import Header from '@/src/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERP LaPlata',
  description: 'ERP LaPlata - Next.js + Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        {/* Header único */}
        <Header />
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </body>
    </html>
  )
}
