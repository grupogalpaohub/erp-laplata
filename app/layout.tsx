import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import FioriShell from '@/components/FioriShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ERP LaPlata',
  description: 'Sistema ERP para gestão empresarial',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          <FioriShell>
            {children}
          </FioriShell>
        </Providers>
      </body>
    </html>
  )
}