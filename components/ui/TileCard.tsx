'use client'

import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface TileCardProps {
  title: string
  subtitle: string
  icon: LucideIcon
  href: string
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'cyan'
}

export default function TileCard({
  title,
  subtitle,
  icon: Icon,
  href,
  color = 'blue'
}: TileCardProps) {
  const colorClasses = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500',
    red: 'text-red-500',
    cyan: 'text-cyan-500'
  }

  return (
    <Link href={href} className="group">
      <div className="bg-gray-800 rounded-lg p-6 hover:bg-gray-700 transition-colors border border-gray-700">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
              {title}
            </h3>
            <p className="text-sm text-gray-400">{subtitle}</p>
          </div>
        </div>
      </div>
    </Link>
  )
}
