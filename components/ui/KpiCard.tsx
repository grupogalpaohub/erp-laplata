'use client'

import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  color?: 'green' | 'blue' | 'orange' | 'red'
}

export default function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'blue'
}: KpiCardProps) {
  const colorClasses = {
    green: 'text-green-500',
    blue: 'text-blue-500',
    orange: 'text-orange-500',
    red: 'text-red-500'
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        <Icon className={`w-5 h-5 ${colorClasses[color]}`} />
      </div>
      <div className="space-y-2">
        <p className={`text-3xl font-bold ${colorClasses[color]}`}>
          {value}
        </p>
        <p className="text-sm text-gray-400">{subtitle}</p>
      </div>
    </div>
  )
}
