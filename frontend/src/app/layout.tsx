import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import FioriShell from '@/src/components/FioriShell'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ERP LaPlata',
  description: 'ERP LaPlata Lunaria',
}

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="pt-br">
      <body className={inter.className}>
        <FioriShell>{children}</FioriShell>
      </body>
    </html>
  )
}