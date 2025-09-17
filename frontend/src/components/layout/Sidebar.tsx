'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings,
  Warehouse,
  TrendingUp
} from 'lucide-react'

const menuItems = [
  { 
    icon: LayoutDashboard, 
    label: 'Dashboard', 
    href: '/dashboard', 
    active: true,
    color: 'text-gray-600'
  },
  { 
    icon: BarChart3, 
    label: 'CO', 
    href: '/co',
    color: 'text-blue-600',
    description: 'Controlling'
  },
  { 
    icon: Package, 
    label: 'MM', 
    href: '/mm',
    color: 'text-purple-600',
    description: 'Material Management'
  },
  { 
    icon: ShoppingCart, 
    label: 'SD', 
    href: '/sd',
    color: 'text-green-600',
    description: 'Sales & Distribution'
  },
  { 
    icon: Warehouse, 
    label: 'WH', 
    href: '/wh',
    color: 'text-orange-600',
    description: 'Warehouse'
  },
  { 
    icon: Users, 
    label: 'CRM', 
    href: '/crm',
    color: 'text-pink-600',
    description: 'Customer Relationship'
  },
  { 
    icon: DollarSign, 
    label: 'FI', 
    href: '/fi',
    color: 'text-cyan-600',
    description: 'Financial Management'
  },
  { 
    icon: TrendingUp, 
    label: 'Analytics', 
    href: '/analytics',
    color: 'text-teal-600',
    description: 'Business Intelligence'
  },
  { 
    icon: Settings, 
    label: 'Setup', 
    href: '/setup',
    color: 'text-gray-600',
    description: 'System Configuration'
  },
]

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">E</span>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">ERP Laplata</h1>
            <p className="text-xs text-gray-500">Sistema de Gestão</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                item.active
                  ? "bg-blue-50 text-blue-700 border border-blue-200"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border hover:border-gray-200"
              )}
            >
              <Icon className={cn(
                "mr-3 h-5 w-5 flex-shrink-0",
                item.active ? "text-blue-600" : item.color
              )} />
              <div className="flex-1 min-w-0">
                <div className="font-medium">{item.label}</div>
                {item.description && (
                  <div className="text-xs text-gray-500 truncate">
                    {item.description}
                  </div>
                )}
              </div>
            </a>
          )
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>LaplataLunaria</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </div>
  )
}