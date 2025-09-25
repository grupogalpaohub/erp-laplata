export const dynamic = 'force-dynamic';

import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-fiori-primary to-fiori-accent flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Logo e Título */}
        <div className="mb-12">
          <div className="w-24 h-24 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
            <span className="text-fiori-primary font-bold text-4xl">E</span>
          </div>
          <h1 className="text-6xl font-bold text-white mb-4">
            ERP La Plata
          </h1>
          <p className="text-xl text-white/90 mb-8">
            Sistema de Gestão Empresarial Completo
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
            <p className="text-white/80">Materiais, Vendas, Estoque, CRM e Financeiro</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguro e Confiável</h3>
            <p className="text-white/80">Autenticação Google e dados protegidos</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rápido e Moderno</h3>
            <p className="text-white/80">Interface intuitiva e responsiva</p>
          </div>
        </div>

        {/* Botão de Login */}
        <div className="space-y-4">
          <Link
            href="/login"
            className="inline-flex items-center px-8 py-4 bg-white text-fiori-primary font-semibold rounded-xl hover:bg-white/90 transition-colors shadow-xl"
          >
            <span className="mr-2">🚀</span>
            Acessar Sistema
          </Link>
          
          <p className="text-white/70 text-sm">
            Faça login com sua conta Google para acessar o sistema
          </p>
        </div>
      </div>
    </div>
  );
}

