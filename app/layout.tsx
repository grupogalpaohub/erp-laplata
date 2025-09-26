import "@/styles/fiori-helpers.css";
import './globals.css'
import FioriShell from '@/components/FioriShell'
import SuppressHydrationWarnings from '@/components/SuppressHydrationWarnings'
import NavBar from '@/components/NavBar'
import Providers from './providers'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'ERP LaPlata' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body suppressHydrationWarning={true}>
        <SuppressHydrationWarnings />
        <Providers>
          <NavBar />
          <FioriShell>{children}</FioriShell>
        </Providers>
      </body>
    </html>
  )
}


