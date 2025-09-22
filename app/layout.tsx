import './globals.css'
import FioriShell from '@/components/FioriShell'
import SuppressHydrationWarnings from '@/components/SuppressHydrationWarnings'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'ERP LaPlata' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning={true}>
        <SuppressHydrationWarnings />
        <FioriShell>{children}</FioriShell>
      </body>
    </html>
  )
}
