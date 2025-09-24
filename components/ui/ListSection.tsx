'use client'

import Link from 'next/link'
import { 
  Users, UserPlus, Phone, Mail, Calendar, Package, TrendingUp, AlertTriangle, 
  BarChart3, Warehouse, ArrowRightLeft, Calculator, DollarSign, TrendingDown, 
  CreditCard, Receipt, Target, PieChart
} from 'lucide-react'

interface ListSectionProps {
  title: string
  viewAllHref?: string
  viewAllText?: string
  iconName: string
  children: React.ReactNode
  emptyState?: {
    iconName: string
    title: string
    description: string
    actionText: string
    actionHref: string
  }
}

const iconMap = {
  Users, UserPlus, Phone, Mail, Calendar, Package, TrendingUp, AlertTriangle,
  BarChart3, Warehouse, ArrowRightLeft, Calculator, DollarSign, TrendingDown,
  CreditCard, Receipt, Target, PieChart
} as const

export default function ListSection({
  title,
  viewAllHref,
  viewAllText = "Ver Todos",
  iconName,
  children,
  emptyState
}: ListSectionProps) {
  const Icon = iconMap[iconName as keyof typeof iconMap] || BarChart3

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Icon className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-white">{title}</h2>
        </div>
        {viewAllHref && (
          <Link 
            href={viewAllHref}
            className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
          >
            {viewAllText}
          </Link>
        )}
      </div>
      
      {children || (emptyState && (
        <div className="text-center py-8">
          {(() => {
            const EmptyIcon = iconMap[emptyState.iconName as keyof typeof iconMap] || BarChart3
            return <EmptyIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          })()}
          <h3 className="text-lg font-medium text-gray-300 mb-2">{emptyState.title}</h3>
          <p className="text-gray-400 mb-4">{emptyState.description}</p>
          <Link 
            href={emptyState.actionHref}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {emptyState.actionText}
          </Link>
        </div>
      ))}
    </div>
  )
}
