import { LucideIcon } from 'lucide-react'

interface KpiCardProps {
  title: string
  value: string | number
  comparisonText?: string
  trend?: 'up' | 'down' | 'neutral'
  icon: LucideIcon
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral'
}

export default function KpiCard({ 
  title, 
  value, 
  comparisonText, 
  trend, 
  icon: Icon, 
  color = 'primary' 
}: KpiCardProps) {
  const colorClasses = {
    primary: 'kpi-fiori-primary',
    success: 'kpi-fiori-success',
    warning: 'kpi-fiori-warning',
    danger: 'kpi-fiori-danger',
    info: 'kpi-fiori-info',
    neutral: 'kpi-fiori-neutral'
  }

  const trendClasses = {
    up: 'text-fiori-success',
    down: 'text-fiori-danger',
    neutral: 'text-fiori-muted'
  }

  return (
    <div className="tile-fiori">
      <div className="flex items-center justify-between mb-4">
        <h3 className="tile-fiori-title text-sm">{title}</h3>
        <Icon className="w-6 h-6" />
      </div>
      <div className={`kpi-fiori ${colorClasses[color]}`}>{value}</div>
      {comparisonText && (
        <p className={`tile-fiori-metric-label ${trend ? trendClasses[trend] : ''}`}>
          {comparisonText}
        </p>
      )}
    </div>
  )
}

