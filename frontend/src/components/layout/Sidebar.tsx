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
  Menu
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/', active: true },
  { icon: Package, label: 'MM/WH', href: '/mm-wh' },
  { icon: ShoppingCart, label: 'SD', href: '/sd' },
  { icon: Users, label: 'CRM', href: '/crm' },
  { icon: DollarSign, label: 'FI', href: '/fi' },
  { icon: BarChart3, label: 'CO', href: '/co' },
  { icon: Settings, label: 'Setup', href: '/setup' },
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <h1 className="text-xl font-bold text-gray-900">ERP Laplata</h1>
          <button
            onClick={onClose}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="mt-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      item.active
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </>
  )
}