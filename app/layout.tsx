import type { Metadata } from 'next'
import FioriShell from '@/src/components/FioriShell'
import './globals.css'

export const metadata: Metadata = {
  title: 'ERP LaPlata',
  description: 'ERP LaPlata - Next.js + Supabase',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <FioriShell>{children}</FioriShell>
      </body>
    </html>
  )
}
