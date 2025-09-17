import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext'

export const metadata = {
  title: "ERP Laplata",
  description: "Sistema de Gestão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-gray-50">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}