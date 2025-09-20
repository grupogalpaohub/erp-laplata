import './globals.css'
import FioriShell from '@/components/FioriShell'

export const metadata = { title: 'ERP LaPlata' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <FioriShell>{children}</FioriShell>
      </body>
    </html>
  )
}
