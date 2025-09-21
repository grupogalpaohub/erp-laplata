import Link from 'next/link'
import { ArrowLeft, Settings } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function SetupPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Link href="/" className="btn-fiori-outline flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Link>
        <div className="text-center flex-1">
          <h1 className="text-4xl font-bold text-fiori-primary mb-4">Configurações do Sistema</h1>
          <p className="text-xl text-fiori-secondary mb-2">Customização e configurações</p>
          <p className="text-lg text-fiori-muted">Gerencie as configurações personalizáveis do ERP</p>
        </div>
        <div className="w-20"></div>
      </div>

      {/* Módulos de Configuração */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Configurações Financeiras */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fiori-primary/10 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-fiori-primary" />
              </div>
              <div>
                <h3 className="card-fiori-title">Financeiro (FI)</h3>
                <p className="text-sm text-fiori-muted">Formas de pagamento e termos</p>
              </div>
            </div>
          </div>
          <div className="card-fiori-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fiori-muted">Formas de Pagamento:</span>
                <span className="font-semibold text-fiori-primary">10</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>À Vista</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>30 Dias</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>PIX</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <p className="text-xs text-fiori-muted">+7 mais...</p>
              </div>
              <Link href="/setup/financial" className="btn-fiori-outline w-full flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Configurar
              </Link>
            </div>
          </div>
        </div>

        {/* Configurações de Materiais */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fiori-info/10 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-fiori-info" />
              </div>
              <div>
                <h3 className="card-fiori-title">Materiais (MM)</h3>
                <p className="text-sm text-fiori-muted">Tipos e classificações</p>
              </div>
            </div>
          </div>
          <div className="card-fiori-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fiori-muted">Tipos de Material:</span>
                <span className="font-semibold text-fiori-info">5</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Matéria-Prima</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Produto Acabado</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Serviço</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <p className="text-xs text-fiori-muted">+2 mais...</p>
              </div>
              <Link href="/setup/materials" className="btn-fiori-outline w-full flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Configurar
              </Link>
            </div>
          </div>
        </div>

        {/* Configurações de Controle */}
        <div className="card-fiori">
          <div className="card-fiori-header">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fiori-warning/10 rounded-full flex items-center justify-center">
                <Settings className="w-5 h-5 text-fiori-warning" />
              </div>
              <div>
                <h3 className="card-fiori-title">Controle (CO)</h3>
                <p className="text-sm text-fiori-muted">Centros de custo</p>
              </div>
            </div>
          </div>
          <div className="card-fiori-content">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-fiori-muted">Centros de Custo:</span>
                <span className="font-semibold text-fiori-warning">8</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Administração</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Produção</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Vendas</span>
                  <span className="px-2 py-1 rounded text-xs bg-fiori-success/10 text-fiori-success">Ativo</span>
                </div>
                <p className="text-xs text-fiori-muted">+5 mais...</p>
              </div>
              <Link href="/setup/control" className="btn-fiori-outline w-full flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Configurar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Resumo de Configurações */}
      <div className="card-fiori">
        <div className="card-fiori-header">
          <h3 className="card-fiori-title">Resumo de Configurações</h3>
        </div>
        <div className="card-fiori-content">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-fiori-primary mb-2">10</div>
              <div className="text-sm text-fiori-muted">Formas de Pagamento</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fiori-info mb-2">5</div>
              <div className="text-sm text-fiori-muted">Tipos de Material</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fiori-warning mb-2">8</div>
              <div className="text-sm text-fiori-muted">Centros de Custo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-fiori-success mb-2">100%</div>
              <div className="text-sm text-fiori-muted">Sistema Configurado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
