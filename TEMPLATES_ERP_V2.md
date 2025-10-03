# 🧩 TEMPLATES ERP V2 - ACELERAR DESENVOLVIMENTO

> **Objetivo:** Templates prontos para copiar/colar e acelerar desenvolvimento
> **Uso:** Substituir `[MODULE]`, `[ENTITY]`, `[FIELD]` pelos valores reais

---

## 🔧 **1. SUPABASE SERVER (ÚNICO)**

```typescript
// lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function supabaseServer() {
  const cookieStore = cookies()
  
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name: string) => cookieStore.get(name)?.value,
        set: (name: string, value: string, options: any) => {
          cookieStore.set({ name, value, ...options })
        },
        remove: (name: string, options: any) => {
          cookieStore.set({ name, value: '', ...options, expires: new Date(0) })
        }
      }
    }
  )
}
```

---

## 🛡️ **2. TENANT HELPER**

```typescript
// utils/tenant.ts
import { supabaseServer } from '@/lib/supabase/server'

export async function getTenantId(): Promise<string | null> {
  const supabase = supabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  return user?.user_metadata?.tenant_id || null
}

export async function requireTenantId(): Promise<string> {
  const tenantId = await getTenantId()
  if (!tenantId) throw new Error('MISSING_TENANT_ID')
  return tenantId
}
```

---

## 📋 **3. SCHEMA ZOD PADRÃO**

```typescript
// lib/schemas/[entity].ts
import { z } from 'zod'

export const [ENTITY]Schema = z.object({
  [FIELD]: z.string().min(1, '[FIELD] obrigatório'),
  [FIELD]: z.number().positive('[FIELD] deve ser positivo'),
  [FIELD]: z.string().email('[FIELD] inválido'),
  [FIELD]: z.string().uuid('[FIELD] inválido'),
  [FIELD]: z.enum(['[VALUE1]', '[VALUE2]'], {
    errorMap: () => ({ message: '[FIELD] inválido' })
  })
})

export type [ENTITY] = z.infer<typeof [ENTITY]Schema>
```

---

## 🗃️ **4. API ROUTE PADRÃO**

```typescript
// app/api/[module]/[entity]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { [ENTITY]Schema } from '@/lib/schemas/[entity]'

export async function GET(req: NextRequest) {
  try {
    const supabase = supabaseServer()
    const tenantId = await requireTenantId()
    
    const { data, error } = await supabase
      .from('[TABLE]')
      .select('*')
      .order('[FIELD]')
    
    if (error) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: 'DB_ERROR', message: error.message } 
      }, { status: 500 })
    }
    
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'AUTH_ERROR', message: 'Não autenticado' } 
    }, { status: 401 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = supabaseServer()
    const tenantId = await requireTenantId()
    const body = await req.json()
    
    const validatedData = [ENTITY]Schema.parse(body)
    
    const { data, error } = await supabase
      .from('[TABLE]')
      .insert([{ ...validatedData, tenant_id: tenantId }])
      .select()
      .single()
    
    if (error) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: 'DB_ERROR', message: error.message } 
      }, { status: 500 })
    }
    
    return NextResponse.json({ ok: true, data })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        ok: false, 
        error: { code: 'VALIDATION_ERROR', message: error.errors[0].message } 
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      ok: false, 
      error: { code: 'AUTH_ERROR', message: 'Não autenticado' } 
    }, { status: 401 })
  }
}
```

---

## 🎨 **5. COMPONENTE UI PADRÃO**

```typescript
// components/ui/[Component].tsx
import { cn } from '@/lib/utils'

interface [Component]Props {
  className?: string
  children: React.ReactNode
  [prop]: [type]
}

export function [Component]({ 
  className, 
  children, 
  [prop] 
}: [Component]Props) {
  return (
    <div className={cn('[BASE_CLASSES]', className)}>
      {children}
    </div>
  )
}
```

---

## 📊 **6. DATA TABLE PADRÃO**

```typescript
// components/ui/DataTable.tsx
import { useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface DataTableProps<T> {
  data: T[]
  columns: ColumnDef<T>[]
  onRowClick?: (row: T) => void
  search?: boolean
  pagination?: boolean
}

export function DataTable<T>({ 
  data, 
  columns, 
  onRowClick, 
  search = false, 
  pagination = false 
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('')
  
  return (
    <div className="space-y-4">
      {search && (
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
        />
      )}
      
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {columns.map((column, index) => (
              <TableHead key={index}>
                {column.header as string}
              </TableHead>
            ))}
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow 
                key={index}
                onClick={() => onRowClick?.(row)}
                className="cursor-pointer hover:bg-gray-50"
              >
                {columns.map((column, colIndex) => (
                  <TableCell key={colIndex}>
                    {column.cell ? column.cell({ row }) : row[column.accessorKey as keyof T]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
```

---

## 📝 **7. FORM PADRÃO**

```typescript
// components/forms/[Entity]Form.tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { [ENTITY]Schema, [ENTITY] } from '@/lib/schemas/[entity]'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'

interface [ENTITY]FormProps {
  [entity]?: [ENTITY]
  onSave: (data: [ENTITY]) => void
  onCancel: () => void
  loading?: boolean
}

export function [ENTITY]Form({ 
  [entity], 
  onSave, 
  onCancel, 
  loading = false 
}: [ENTITY]FormProps) {
  const [error, setError] = useState<string | null>(null)
  
  const form = useForm<[ENTITY]>({
    resolver: zodResolver([ENTITY]Schema),
    defaultValues: [entity] || {}
  })
  
  const onSubmit = async (data: [ENTITY]) => {
    try {
      setError(null)
      await onSave(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }
  
  return (
    <Card className="p-6">
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...form.register('[FIELD]')}
          label="[FIELD_LABEL]"
          error={form.formState.errors.[FIELD]?.message}
        />
        
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        <div className="flex gap-2">
          <Button type="submit" disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </Card>
  )
}
```

---

## 📄 **8. PAGE PADRÃO**

```typescript
// app/(protected)/[module]/[entity]/page.tsx
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { DataTable } from '@/components/ui/DataTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface [ENTITY] {
  [FIELD]: string
  [FIELD]: number
  // ... outros campos
}

export default async function [ENTITY]Page() {
  const supabase = supabaseServer()
  const tenantId = await requireTenantId()
  
  const { data: [entity]s, error } = await supabase
    .from('[TABLE]')
    .select('*')
    .order('[FIELD]')
  
  if (error) {
    return <div>Erro ao carregar dados</div>
  }
  
  const columns: ColumnDef<[ENTITY]>[] = [
    {
      accessorKey: '[FIELD]',
      header: '[FIELD_LABEL]'
    },
    {
      accessorKey: '[FIELD]',
      header: '[FIELD_LABEL]'
    }
  ]
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">[ENTITY_LABEL]</h1>
        <Link href="/[module]/[entity]/new">
          <Button>Novo [ENTITY_LABEL]</Button>
        </Link>
      </div>
      
      <DataTable 
        data={[entity]s || []} 
        columns={columns}
        search
        pagination
      />
    </div>
  )
}
```

---

## 🎯 **9. KPI CARD PADRÃO**

```typescript
// components/ui/KpiCard.tsx
interface KpiCardProps {
  title: string
  value: string | number
  change?: number
  trend?: 'up' | 'down' | 'stable'
  icon?: React.ReactNode
  color?: string
}

export function KpiCard({ 
  title, 
  value, 
  change, 
  trend = 'stable', 
  icon, 
  color = 'blue' 
}: KpiCardProps) {
  const trendColor = {
    up: 'text-green-500',
    down: 'text-red-500',
    stable: 'text-gray-500'
  }
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        {icon && (
          <div className={`text-${color}-500`}>
            {icon}
          </div>
        )}
      </div>
      {change !== undefined && (
        <div className={`text-sm ${trendColor[trend]}`}>
          {trend === 'up' && '+'}
          {change}%
        </div>
      )}
    </div>
  )
}
```

---

## 🚀 **10. DASHBOARD PADRÃO**

```typescript
// app/(protected)/dashboard/page.tsx
import { supabaseServer } from '@/lib/supabase/server'
import { requireTenantId } from '@/utils/tenant'
import { KpiCard } from '@/components/ui/KpiCard'

export default async function DashboardPage() {
  const supabase = supabaseServer()
  const tenantId = await requireTenantId()
  
  // KPIs MM
  const { data: mmKpis } = await supabase
    .from('mm_purchase_order')
    .select('total_amount_cents, status')
  
  const spendMTD = mmKpis
    ?.filter(po => po.status === 'received')
    ?.reduce((sum, po) => sum + po.total_amount_cents, 0) || 0
  
  // KPIs SD
  const { data: sdKpis } = await supabase
    .from('sd_sales_order')
    .select('total_amount_cents, status')
  
  const revenueMTD = sdKpis
    ?.filter(so => so.status === 'delivered')
    ?.reduce((sum, so) => sum + so.total_amount_cents, 0) || 0
  
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Spend MTD"
          value={`R$ ${(spendMTD / 100).toFixed(2)}`}
          trend="up"
        />
        
        <KpiCard
          title="Receita MTD"
          value={`R$ ${(revenueMTD / 100).toFixed(2)}`}
          trend="up"
        />
        
        <KpiCard
          title="POs Abertos"
          value={mmKpis?.filter(po => po.status === 'draft').length || 0}
        />
        
        <KpiCard
          title="SOs Abertos"
          value={sdKpis?.filter(so => so.status === 'draft').length || 0}
        />
      </div>
    </div>
  )
}
```

---

## 📋 **11. CHECKLIST DE USO**

### **Antes de Usar:**
- [ ] Substituir `[MODULE]` pelo módulo (mm, sd, wh, fi)
- [ ] Substituir `[ENTITY]` pela entidade (material, vendor, etc.)
- [ ] Substituir `[FIELD]` pelos campos reais
- [ ] Substituir `[TABLE]` pelo nome da tabela
- [ ] Ajustar validações Zod conforme schema

### **Após Usar:**
- [ ] Testar RLS (dados por tenant)
- [ ] Validar nomes = dump
- [ ] Testar triggers funcionando
- [ ] Validar formulários

---

## 🎯 **12. COMANDOS ÚTEIS**

```bash
# Criar novo módulo
mkdir -p app/\(protected\)/[module]/{[entity],kpis}
mkdir -p app/api/[module]/[entity]

# Criar componentes
mkdir -p components/modules/[module]
mkdir -p components/forms

# Verificar build
npm run build && npm run typecheck && npm run lint
```

---

> **💡 Dica:** Use estes templates como base e customize conforme necessário. Sempre valide com o database dump antes de implementar!

**🚀 Templates prontos para acelerar o desenvolvimento!**
