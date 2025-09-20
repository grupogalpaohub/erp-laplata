type Props = {
  title: string
  value?: string | number
  kpiState?: 'good' | 'warn' | 'bad'
  footer?: string
  href?: string
}
export default function FioriTile({ title, value, kpiState, footer, href }: Props) {
  const kpiColor =
    kpiState === 'good' ? 'text-fiori-kpi-good' :
    kpiState === 'warn' ? 'text-fiori-kpi-warn' :
    kpiState === 'bad'  ? 'text-fiori-kpi-bad'  : 'text-white'
  const content = (
    <div className="fiori-tile">
      <div className="fiori-kpi">{title}</div>
      {value !== undefined && (
        <div className={`fiori-kpi-value ${kpiColor}`}>{value}</div>
      )}
      {footer && <div className="mt-2 text-xs text-fiori-muted">{footer}</div>}
    </div>
  )
  if (href) {
    return <a href={href} className="block">{content}</a>
  }
  return content
}
