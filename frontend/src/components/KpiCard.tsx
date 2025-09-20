import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  comparisonText?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'cyan'
}

export default function KpiCard({ 
  title, 
  value, 
  comparisonText, 
  trend, 
  icon: Icon, 
  color = 'blue' 
}: KpiCardProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    green: 'text-green-600 bg-green-100',
    purple: 'text-purple-600 bg-purple-100',
    red: 'text-red-600 bg-red-100',
    orange: 'text-orange-600 bg-orange-100',
    cyan: 'text-cyan-600 bg-cyan-100'
  }

  const trendClasses = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
          {comparisonText && (
            <p className={`text-xs ${trend ? trendClasses[trend] : 'text-gray-400'}`}>
              {comparisonText}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

