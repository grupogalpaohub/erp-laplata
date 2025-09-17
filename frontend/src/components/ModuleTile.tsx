import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface ModuleTileProps {
  title: string
  description: string
  icon: LucideIcon
  href: string
  actions?: Array<{
    label: string
    href: string
    variant?: 'default' | 'outline' | 'secondary'
  }>
  className?: string
}

export function ModuleTile({ 
  title, 
  description, 
  icon: Icon, 
  href, 
  actions = [],
  className 
}: ModuleTileProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Icon className="h-6 w-6 text-primary" />
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Button asChild className="w-full">
            <a href={href}>Acessar Módulo</a>
          </Button>
          {actions.length > 0 && (
            <div className="flex flex-col space-y-1">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  asChild
                  variant={action.variant || 'outline'}
                  size="sm"
                  className="w-full"
                >
                  <a href={action.href}>{action.label}</a>
                </Button>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}