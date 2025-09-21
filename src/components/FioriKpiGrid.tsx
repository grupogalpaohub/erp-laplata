import { ReactNode } from 'react'

interface KpiItem {
  title: string
  value: string | number
  label: string
  color: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
  icon: ReactNode
}

interface FioriKpiGridProps {
  title: string
  items: KpiItem[]
  columns?: 2 | 3 | 4
}

export default function FioriKpiGrid({ 
  title, 
  items, 
  columns = 4 
}: FioriKpiGridProps) {
  const gridClass = `grid-fiori-${columns}`

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-semibold text-fiori-primary mb-6">{title}</h2>
      <div className={gridClass}>
        {items.map((item, index) => (
          <div key={index} className="tile-fiori">
            <div className="flex items-center justify-between mb-4">
              <h3 className="tile-fiori-title text-sm">{item.title}</h3>
              {item.icon}
            </div>
            <div className={`kpi-fiori kpi-fiori-${item.color}`}>
              {item.value}
            </div>
            <p className="tile-fiori-metric-label">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
