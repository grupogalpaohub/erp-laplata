import Link from 'next/link'
import NewPOClient from './NewPOClient'
import { getVendors } from '@/app/(protected)/mm/_actions'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { requireSession } from '@/lib/auth/requireSession'

type Vendor = {
  vendor_id: string
  vendor_name: string
}

type Material = {
  mm_material: string
  mm_comercial: boolean // mapeado no código
  mm_desc: string
  mm_purchase_price_cents: number | null
}

export default async function NewPOPage() {
  await requireSession()
  
  // Carregar dados iniciais via SSR
  const [vendors, materials] = await Promise.all([
    getVendors(),
    getMaterials()
  ])

  async function getMaterials(): Promise<Material[]> {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
        },
      }
    )
    
    // Obter tenant_id da sessão
    const { data: { session } } = await supabase.auth.getSession()
    const tenant_id = session?.user?.user_metadata?.tenant_id || 'LaplataLunaria'
    
    const { data, error } = await supabase
      .from("mm_material")
      .select("mm_material, mm_desc, mm_purchase_price_cents")
      .eq("tenant_id", tenant_id)
      .eq("status", "active")
      .order("mm_material")

    if (error) {
      console.error("Erro ao buscar materiais:", error)
      return []
    }

    // Garantir que sempre retorna um array
    return Array.isArray(data) ? data : []
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-fiori-primary mb-4">Criar Pedido de Compras</h1>
        <p className="text-xl text-fiori-secondary mb-2">Gerar novo pedido de compras</p>
        <p className="text-lg text-fiori-muted">Selecione fornecedor e materiais para criar o pedido</p>
      </div>

      {/* Back Button */}
      <div className="flex justify-center">
        <Link href="/mm/purchases" className="btn-fiori-outline">Voltar</Link>
      </div>

      {/* Client Component */}
      <NewPOClient vendors={vendors} materials={materials} />
    </div>
  )
}

