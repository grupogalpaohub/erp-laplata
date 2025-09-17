'use client'

import { cn } from '@/lib/utils'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings 
} from 'lucide-react'

interface ModuleTileProps {
  title: string
  description: string
  href: string
  icon: string
  color: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'
}

const iconMap = {
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  BarChart3,
  Settings
}

const colorClasses = {
  blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
  green: 'bg-green-50 text-green-600 hover:bg-green-100',
  purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
  yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
  red: 'bg-red-50 text-red-600 hover:bg-red-100',
  gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100'
}

export function ModuleTile({ title, description, href, icon, color }: ModuleTileProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Package

  return (
    <a
      href={href}
      className={cn(
        "block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
      )}
    >
      <div className="flex items-center">
        <div className={cn(
          "flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center",
          colorClasses[color]
        )}>
          <IconComponent className="h-6 w-6" />
        </div>
        <div className="ml-4">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </a>
  )
}