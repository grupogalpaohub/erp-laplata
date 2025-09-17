'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string
  comparisonText: string
  trend?: 'up' | 'down' | 'neutral'
  highlightColor?: 'green' | 'red' | 'blue' | 'orange' | 'purple'
  icon?: LucideIcon
  badge?: string
}

export function KpiCard({ 
  title, 
  value, 
  comparisonText, 
  trend = 'neutral',
  highlightColor = 'blue',
  icon: Icon,
  badge
}: KpiCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case 'down':
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600'
      case 'down':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  const getHighlightColor = () => {
    switch (highlightColor) {
      case 'green':
        return 'text-green-600'
      case 'red':
        return 'text-red-600'
      case 'blue':
        return 'text-blue-600'
      case 'orange':
        return 'text-orange-600'
      case 'purple':
        return 'text-purple-600'
      default:
        return 'text-blue-600'
    }
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            {Icon && <Icon className="h-5 w-5 text-gray-500" />}
            <p className="text-sm font-medium text-gray-600">{title}</p>
            {badge && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {badge}
              </span>
            )}
          </div>
          <p className={cn("text-3xl font-bold mb-1", getHighlightColor())}>
            {value}
          </p>
          <p className="text-sm text-gray-500 leading-relaxed">
            {comparisonText}
          </p>
        </div>
        {trend !== 'neutral' && (
          <div className="flex items-center space-x-1 ml-4">
            {getTrendIcon()}
            <span className={cn("text-sm font-medium", getTrendColor())}>
              {badge}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}