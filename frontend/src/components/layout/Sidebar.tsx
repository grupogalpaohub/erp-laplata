'use client'

import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings
} from 'lucide-react'

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', active: true },
  { icon: Package, label: 'MM/WH', href: '/mm-wh' },
  { icon: ShoppingCart, label: 'SD', href: '/sd' },
  { icon: Users, label: 'CRM', href: '/crm' },
  { icon: DollarSign, label: 'FI', href: '/fi' },
  { icon: BarChart3, label: 'CO', href: '/co' },
  { icon: Settings, label: 'Setup', href: '/setup' },
]

export function Sidebar() {
  return (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:shadow-lg">
      <div className="flex items-center h-16 px-6 border-b">
        <h1 className="text-xl font-bold text-gray-900">ERP Laplata</h1>
      </div>
      
      <nav className="flex-1 mt-6 px-3">
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
  )
}