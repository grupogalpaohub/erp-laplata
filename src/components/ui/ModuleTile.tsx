'use client'
import Link from 'next/link'
import { ReactNode } from 'react'
import { cn } from '@/src/lib/utils'
import { ArrowRight } from 'lucide-react'

type Props = {
  href: string
  title: string
  description?: string
  icon?: ReactNode
  kpi?: string | ReactNode
  accent?: 'blue'|'purple'|'green'|'orange'|'pink'|'sky'|'teal'
  className?: string
}

const accentRing: Record<NonNullable<Props['accent']>, string> = {
  blue:   'ring-blue-200 hover:ring-blue-300',
  purple: 'ring-purple-200 hover:ring-purple-300',
  green:  'ring-green-200 hover:ring-green-300',
  orange: 'ring-orange-200 hover:ring-orange-300',
  pink:   'ring-pink-200 hover:ring-pink-300',
  sky:    'ring-sky-200 hover:ring-sky-300',
  teal:   'ring-teal-200 hover:ring-teal-300',
}

export default function ModuleTile({
  href, title, description, icon, kpi, accent='blue', className
}: Props) {
  return (
    <Link
      href={href}
      className={cn(
        'group rounded-2xl border border-fiori-border ring-1 transition-all',
        'bg-[#0e2a45]/60 hover:bg-[#0e2a45]/80 hover:-translate-y-0.5',
        'p-4 sm:p-5 flex flex-col gap-3 justify-between min-h-[120px]',
        accentRing[accent],
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 text-fiori-muted">
          {icon ?? <div className="w-5 h-5 rounded bg-white/10" />}
        </div>
        <div className="flex-1">
          <div className="text-base font-semibold">{title}</div>
          {description && (
            <div className="text-sm text-fiori-muted mt-0.5">{description}</div>
          )}
        </div>
        <ArrowRight className="w-4 h-4 opacity-60 group-hover:opacity-100 transition" />
      </div>
      {kpi && (
        <div className="text-right text-xs text-fiori-muted">
          {kpi}
        </div>
      )}
    </Link>
  )
}
