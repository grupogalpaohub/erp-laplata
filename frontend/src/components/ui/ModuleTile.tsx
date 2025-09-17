'use client'

import { cn } from '@/lib/utils'
import { 
  Package, 
  ShoppingCart, 
  Users, 
  DollarSign, 
  BarChart3, 
  Settings,
  Warehouse,
  TrendingUp,
  LucideIcon
} from 'lucide-react'

interface ModuleTileProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  color: 'co' | 'mm' | 'sd' | 'wh' | 'crm' | 'fi' | 'analytics'
  links?: Array<{
    label: string
    href: string
  }>
  badge?: string
  badgeCount?: number
}

const colorConfig = {
  co: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    hover: 'hover:bg-blue-100',
    border: 'border-blue-200',
    icon: 'text-blue-600'
  },
  mm: {
    bg: 'bg-purple-50',
    text: 'text-purple-600',
    hover: 'hover:bg-purple-100',
    border: 'border-purple-200',
    icon: 'text-purple-600'
  },
  sd: {
    bg: 'bg-green-50',
    text: 'text-green-600',
    hover: 'hover:bg-green-100',
    border: 'border-green-200',
    icon: 'text-green-600'
  },
  wh: {
    bg: 'bg-orange-50',
    text: 'text-orange-600',
    hover: 'hover:bg-orange-100',
    border: 'border-orange-200',
    icon: 'text-orange-600'
  },
  crm: {
    bg: 'bg-pink-50',
    text: 'text-pink-600',
    hover: 'hover:bg-pink-100',
    border: 'border-pink-200',
    icon: 'text-pink-600'
  },
  fi: {
    bg: 'bg-cyan-50',
    text: 'text-cyan-600',
    hover: 'hover:bg-cyan-100',
    border: 'border-cyan-200',
    icon: 'text-cyan-600'
  },
  analytics: {
    bg: 'bg-teal-50',
    text: 'text-teal-600',
    hover: 'hover:bg-teal-100',
    border: 'border-teal-200',
    icon: 'text-teal-600'
  }
}

export function ModuleTile({ 
  title, 
  description, 
  href, 
  icon: Icon, 
  color, 
  links = [],
  badge,
  badgeCount
}: ModuleTileProps) {
  const config = colorConfig[color]

  return (
    <a
      href={href}
      className={cn(
        "block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 group"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            config.bg,
            config.icon
          )}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
        </div>
        
        {/* Badge */}
        {(badge || badgeCount) && (
          <div className="flex flex-col items-end space-y-1">
            {badge && (
              <span className={cn(
                "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
                config.bg,
                config.text
              )}>
                {badge}
              </span>
            )}
            {badgeCount && (
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-600 text-xs font-bold">
                {badgeCount}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Links internos */}
      {links.length > 0 && (
        <div className="space-y-2">
          <div className="h-px bg-gray-100"></div>
          <div className="grid grid-cols-1 gap-1">
            {links.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className={cn(
                  "text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 px-2 py-1 rounded-md transition-colors",
                  "group/link"
                )}
                onClick={(e) => e.stopPropagation()}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </a>
  )
}