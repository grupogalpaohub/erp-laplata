'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Warehouse, 
  Users, 
  DollarSign, 
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'

const navigation = [
  { name: 'Launchpad', href: '/launchpad', icon: LayoutDashboard },
  { name: 'MM - Materiais', href: '/mm', icon: Package },
  { name: 'SD - Vendas', href: '/sd', icon: ShoppingCart },
  { name: 'WH - Depósitos', href: '/wh', icon: Warehouse },
  { name: 'CRM - Leads', href: '/crm', icon: Users },
  { name: 'FI - Financeiro', href: '/fi', icon: DollarSign },
  { name: 'CO - Controladoria', href: '/co', icon: BarChart3 },
  { name: 'Setup', href: '/setup', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <div className={cn(
      "bg-card border-r transition-all duration-300 flex flex-col",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-xl font-bold text-primary">ERP Laplata</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}