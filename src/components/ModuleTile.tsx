import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface ModuleLink {
  href: string
  label: string
  badge?: string | number
}

interface ModuleTileProps {
  title: string
  icon: LucideIcon
  color: 'blue' | 'purple' | 'green' | 'orange' | 'pink' | 'cyan' | 'teal'
  links: ModuleLink[]
  description?: string
}

export default function ModuleTile({ 
  title, 
  icon: Icon, 
  color, 
  links, 
  description 
}: ModuleTileProps) {
  const colorClasses = {
    blue: 'text-blue-600 bg-blue-100',
    purple: 'text-purple-600 bg-purple-100',
    green: 'text-green-600 bg-green-100',
    orange: 'text-orange-600 bg-orange-100',
    pink: 'text-pink-600 bg-pink-100',
    cyan: 'text-cyan-600 bg-cyan-100',
    teal: 'text-teal-600 bg-teal-100'
  }

  const hoverColorClasses = {
    blue: 'hover:text-blue-600',
    purple: 'hover:text-purple-600',
    green: 'hover:text-green-600',
    orange: 'hover:text-orange-600',
    pink: 'hover:text-pink-600',
    cyan: 'hover:text-cyan-600',
    teal: 'hover:text-teal-600'
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-200 hover:scale-105">
      <div className="flex items-center mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="ml-3">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        {links.map((link, index) => (
          <Link
            key={index}
            href={link.href}
            className={`block text-sm text-gray-600 ${hoverColorClasses[color]} transition-colors duration-200 flex items-center justify-between`}
          >
            <span>{link.label}</span>
            {link.badge && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {link.badge}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}

