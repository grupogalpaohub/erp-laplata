'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  DollarSign, 
  BarChart3,
  Menu,
  X,
  LogOut,
  User,
  Search,
  Bell
} from 'lucide-react'

const navigation = [
  { name: 'Controle', href: '/', icon: BarChart3 },
  { name: 'Materiais', href: '/mm', icon: Package },
  { name: 'Estoque', href: '/wh', icon: Warehouse },
  { name: 'Vendas', href: '/sd', icon: ShoppingCart },
  { name: 'CRM', href: '/crm', icon: Users },
  { name: 'Financeiro', href: '/fi', icon: DollarSign },
]

export default function FioriShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-semibold text-gray-900">ERP LaPlata</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600"
            >
              <Menu className="h-5 w-5" />
            </button>
            
            <div className="flex items-center space-x-4">
              {/* Busca Global */}
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors duration-200"
              >
                <Search className="h-4 w-4" />
                <span>Buscar...</span>
              </button>
              
              <div className="text-sm text-gray-600">
                LaplataLunaria
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200">
                  <Bell className="h-5 w-5" />
                </button>
                <User className="h-5 w-5 text-gray-400" />
                <Link
                  href="/api/logout"
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Sair
                </Link>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1">
          {children}
        </main>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Modal de Busca Global */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-start justify-center min-h-screen pt-16 px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setSearchOpen(false)} />
            <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Busca Global</h3>
                  <button
                    onClick={() => setSearchOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar materiais, clientes, pedidos..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  <p>Digite para buscar em:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Materiais e catálogo</li>
                    <li>• Clientes e fornecedores</li>
                    <li>• Pedidos de compra e venda</li>
                    <li>• Relatórios e documentos</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
